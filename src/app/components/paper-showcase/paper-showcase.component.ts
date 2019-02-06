import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaperScope, Project, Path, Point, Shape, Color } from 'paper';
import * as paper from 'paper';
import { Cipher } from 'crypto';
import { pipe } from 'rxjs';
import { LineToLineMappedSource } from 'webpack-sources';
import { KeyEventsPlugin } from '@angular/platform-browser/src/dom/events/key_events';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { deflateRaw } from 'zlib';
import { start } from 'repl';

@Component({
  selector: 'app-paper-showcase',
  templateUrl: './paper-showcase.component.html',
  styleUrls: ['./paper-showcase.component.css']
})
export class PaperShowcaseComponent implements OnInit {
    @ViewChild('canvasElement') canvasElement: ElementRef;
    scope: PaperScope;
    project: Project;

    constructor() { }

    name = 'Angular';

    lines = [];

    ngOnInit()
    {
        this.draw();
    }
    
    draw() {
        var degrees = function(degrees:number) : number
        {
            return Math.PI * degrees / 180 + Math.PI/2;
        }

        var pointOnCircle = function(circle: Shape, deg:number) : Point
        {
            var angle = degrees(deg);
            var vec: Point = new Point(<number>Math.sin(angle), <number>Math.cos(angle));
            vec = vec.multiply(<number>circle.radius);
            vec = vec.add(circle.position);

            return vec;
        }

        var drawTriangle = function(circle: Shape, deg:number) : void
        {
            var point : Point[] = []
            point[0] = pointOnCircle(circle, deg);
            point[1] = pointOnCircle(circle, deg + 120);
            point[2] = pointOnCircle(circle, deg + 240);

            var line : Path.Line[] = []
            line[0] = new Path.Line(point[0], point[1]);
            line[1] = new Path.Line(point[1], point[2]);
            line[2] = new Path.Line(point[2], point[0]);

            for (let i = 0; i < line.length; ++i)
            {
                line[i].strokeColor = 'white';
            }
        }

        var drawCircle = function(circle: Shape, startAngle:number, numTriangles:number, step:number)
        {
            for (var i = 0; i < numTriangles; ++i)
            {
                drawTriangle(circle, startAngle + i * step);
            }
        }

        window['paper'] = paper;
        const project1 = new Project('cv1');
        
        const origin = new Point(0, 0);

        // CANVAS SETTINGS
        var canvas_color = new Color('red');
        var canvas_size = new paper.Size(400, 400);
        var canvas_center = new Point(canvas_size.width/2, canvas_size.height/2);
        var canvas = Shape.Rectangle({
            point: origin,
            size: canvas_size,
            fillColor: canvas_color
        });

        
        // CIRCLE SETTINGS
        const outer_circle_radius = 300;
        var outer_circle = Shape.Circle({
            center: canvas.position,
            radius: outer_circle_radius,
            //fillColor: 'blue',
        });
        var inner_circle = Shape.Circle({
            center: canvas.position,
            radius: outer_circle_radius/2,
            //fillColor: 'blue',
        });


        //var angle = 10;
        

        // LINE SETTINGS
        const start_angle = 0;
        const num_triangles = 24;
        const increment_angle = 120/num_triangles;
        const line_color = new Color('green');
        var line_width = 1.5;

        var num_tri_outer = 1;
        var num_tri_inner = 0;
        paper.view.onFrame = function onFrame(event)
        {
            canvas = Shape.Rectangle({
                point: origin,
                size: canvas_size,
                fillColor: 'blue'
            });

            //canvas.fillColor.hue += Math.random() *100;
            drawCircle(outer_circle, start_angle, 24, increment_angle);
            drawCircle(inner_circle, start_angle, num_tri_inner, increment_angle);

            (<number>outer_circle.radius) = outer_circle_radius + outer_circle_radius*(num_tri_outer+num_tri_inner)/(2*num_triangles);
            (<number>inner_circle.radius) = outer_circle_radius/2 + outer_circle_radius/2*(num_tri_outer+num_tri_inner)/(2*num_triangles);
            
            // Shape.Circle({
            //     center: canvas.position,
            //     radius: outer_circle.radius,
            //     fillColor: 'lightblue',
            // });
            // Shape.Circle({
            //     center: canvas.position,
            //     radius: inner_circle.radius,
            //     fillColor: 'pink',
            // });
            
            // if (inner_circle.radius >= outer_circle_radius)
            // {
            //     outer_circle.radius = outer_circle_radius;
            //     inner_circle.radius = outer_circle_radius/2;
            // }

            if (num_tri_inner == num_triangles-1)
            {
                num_tri_outer = 0;
                num_tri_inner = 0;
            }
            if (num_tri_outer == num_triangles)
            {
                ++num_tri_inner;
            }
            else
            {
                ++num_tri_outer;
            }

        }
        
        // paper.view.onFrame = function onFrame(event) {
        //     if (size >= 800) size = 400; 

        //     canvas.fillColor = 'black'
        
        //     for (var n = 0; n <=4; n++)
        //     {
        //         var circ = Shape.Circle({
        //             center: new Point(width/2, height/2),
        //             radius: size/(Math.pow(2,n)),
        //             //strokeColor: 'black'
        //         });

    
        //         for (var i = 0; i <= 360; )
        //         {
        //             var ptA = pointOnCircle(circ, i);
        //             var ptB = pointOnCircle(circ, 120+i);
        //             var ptC = pointOnCircle(circ, 240+i);
            
        //             var ln1 = new Path.Line(ptA, ptB);
        //             var ln2 = new Path.Line(ptB, ptC);
        //             i+=20;
        //             ptA = pointOnCircle(circ, i);
        //             //var ln3 = new Path.Line(ptC, ptA);
        //             color.hue+=1;

        //             ln1.strokeColor = color;
        //             ln2.strokeColor = color;
        //             ln1.strokeWidth = 0.5;
        //             ln2.strokeWidth = 0.5;
        //             //ln3.strokeColor = 'purple';
        //         }
        //         size+=10;
        //     }
        // }

    }
}

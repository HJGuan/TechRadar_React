import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {forceSimulation,forceCollide} from 'd3';





export default function Radar (props) {

    const svgRef = useRef();
    const width=1450;
    const height= 1000 ;
    const colors={
      background: "#fff",
      grid: '#dddde0',
      inactive: "#ddd"
    };
    const title = "Zalando Tech Radar";
    const date = "2023.02";

    const quadrantsDefined=[
      { name: "Languages" },
      { name: "Infrastructure" },
      { name: "Datastores" },
      { name: "Data Management" },
    ];
    const ringsDefined=[
      { name: "ADOPT", color: "#5ba300" },
      { name: "TRIAL", color: "#009eb0" },
      { name: "ASSESS", color: "#c7ba00" },
      { name: "HOLD", color: "#e09b96" }
    ];

    const print_layout= true;


    var seed = 42;
    function random() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
  
    function random_between(min, max) {
      return min + random() * (max - min);
    }
  
    function normal_between(min, max) {
      return min + (random() + random()) * 0.5 * (max - min);
    }
  
    // radial_min / radial_max are multiples of PI
    const quadrants = [
      { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
      { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
      { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
      { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
    ];
  
    const rings = [
      { radius: 130 },
      { radius: 220 },
      { radius: 310 },
      { radius: 400 }
    ];
  
    const title_offset =
      { x: -675, y: -420 };
  
    const footer_offset =
      { x: -675, y: 420 };
  
    const legend_offset = [
      { x: 450, y: 90 },
      { x: -675, y: 90 },
      { x: -675, y: -310 },
      { x: 450, y: -310 }
    ];
  
    function polar(cartesian) {
      var x = cartesian.x;
      var y = cartesian.y;
      return {
        t: Math.atan2(y, x),
        r: Math.sqrt(x * x + y * y)
      }
    }
  
    function cartesian(polar) {
      return {
        x: polar.r * Math.cos(polar.t),
        y: polar.r * Math.sin(polar.t)
      }
    }
  
    function bounded_interval(value, min, max) {
      var low = Math.min(min, max);
      var high = Math.max(min, max);
      return Math.min(Math.max(value, low), high);
    }
  
    function bounded_ring(polar, r_min, r_max) {
      return {
        t: polar.t,
        r: bounded_interval(polar.r, r_min, r_max)
      }
    }
  
    function bounded_box(point, min, max) {
      return {
        x: bounded_interval(point.x, min.x, max.x),
        y: bounded_interval(point.y, min.y, max.y)
      }
    }
  
    function segment(quadrant, ring) {
      var polar_min = {
        t: quadrants[quadrant].radial_min * Math.PI,
        r: ring === 0 ? 30 : rings[ring - 1].radius
      };
      var polar_max = {
        t: quadrants[quadrant].radial_max * Math.PI,
        r: rings[ring].radius
      };
      var cartesian_min = {
        x: 15 * quadrants[quadrant].factor_x,
        y: 15 * quadrants[quadrant].factor_y
      };
      var cartesian_max = {
        x: rings[3].radius * quadrants[quadrant].factor_x,
        y: rings[3].radius * quadrants[quadrant].factor_y
      };
      return {
        clipx: function(d) {
          var c = bounded_box(d, cartesian_min, cartesian_max);
          var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
          d.x = cartesian(p).x; // adjust data too!
          return d.x;
        },
        clipy: function(d) {
          var c = bounded_box(d, cartesian_min, cartesian_max);
          var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
          d.y = cartesian(p).y; // adjust data too!
          return d.y;
        },
        random: function() {
          return cartesian({
            t: random_between(polar_min.t, polar_max.t),
            r: normal_between(polar_min.r, polar_max.r)
          });
        }
      }
    }

    // partition entries according to segments
    var segmented = new Array(4);
    for (var quadrant = 0; quadrant < 4; quadrant++) {
        segmented[quadrant] = new Array(4);
        for (var ring = 0; ring < 4; ring++) {
            segmented[quadrant][ring] = [];
        }
    }
    for (var i=0; i<props.entries.length; i++) {
        var entry = props.entries[i];
        segmented[entry.quadrant][entry.ring].push(entry);
    }

    // assign unique sequential id to each entry
    var id = 1;
    for (var quadrant of [2,3,1,0]) {
        for (var ring = 0; ring < 4; ring++) {
            var entries = segmented[quadrant][ring];
            entries.sort(function(a,b) { return a.label.localeCompare(b.label); })
            for (var i=0; i<entries.length; i++) {
            entries[i].id = "" + id++;
            }
        }
    }

    function translate(x, y) {
        return "translate(" + x + "," + y + ")";
    }

    function viewbox(quadrant) {
        return [
            Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
            Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
            440,
            440
        ].join(" ");
    }

    
    function legend_transform(quadrant, ring, index=null) {
      var dx = ring < 2 ? 0 : 140;
      var dy = (index == null ? -16 : index * 12);
      if (ring % 2 === 1) {
        dy = dy + 36 + segmented[quadrant][ring-1].length * 12;
      }
      return translate(
        legend_offset[quadrant].x + dx,
        legend_offset[quadrant].y + dy
      );
    }

    function showBubble(d) {
      if (d.active || print_layout) {
          var tooltip = d3.select("#bubble text")
          .text(d.label);
          var bbox = tooltip.node().getBBox();
          d3.select("#bubble")
          .attr("transform", translate(d.x - bbox.width / 2, d.y - 16))
          .style("opacity", 0.8);
          d3.select("#bubble rect")
          .attr("x", -5)
          .attr("y", -bbox.height)
          .attr("width", bbox.width + 10)
          .attr("height", bbox.height + 4);
          d3.select("#bubble path")
          .attr("transform", translate(bbox.width / 2 - 5, 3));
      }
  }

    function hideBubble(d) {
        var bubble = d3.select("#bubble")
            .attr("transform", translate(0,0))
            .style("opacity", 0);
    }

    function highlightLegendItem(d) {
      d3.select("#legendItem"+d.id)
        .attr("filter", "url(#solid)")
        .attr("fill", "white");
    }
  
    function unhighlightLegendItem(d) {
      d3.select("#legendItem"+d.id)
        .attr("filter",null)
        .attr("fill",null);
    }
    

    function onSelected(d) {
      // const spots = Spot(d._id, d.label, d.quadrant, d.ring );
      props.onSelectSpot([{_id:d._id, label: d.label,quadrant:d.quadrant, ring:d.ring}]);
    }

    // when the clicked element has a "click" event listener
    // d3.select('html').on("click", function(event) {
    //   const clickedElement = d3.select(event.target);
    //   const hasClickListener = clickedElement.on("click") !== undefined;
    //   const isInForm = clickedElement.node().closest('form') !== null||clickedElement.node().closest('option') !== null;
    //   const isOption = clickedElement.classed('ant-select-item-option-content');
    //   const isOption2 = clickedElement.classed("ant-select-item ant-select-item-option");
    //   if (!hasClickListener&&!isInForm&&!isOption&&!isOption2) {
    //     console.log("click blank area")
    //     props.onSelectSpot([]);
    //   }
    // });


    
    
    // position each entry randomly in its segment
    for (var i = 0; i < props.entries.length; i++) {
      var entry = props.entries[i];
      entry.segment = segment(entry.quadrant, entry.ring);
      var point = entry.segment.random();
      entry.x = point.x;
      entry.y = point.y;
      entry.color = entry.active || print_layout ?
        ringsDefined[entry.ring].color : colors.inactive;
    }

    useEffect(() => {

        const svg = d3.select(svgRef.current)

        svg.selectAll('*').remove()

        svg.style("background-color", colors.background)
            .attr("width", width)
            .attr("height", height);
            

        var radar = svg.append("g");
        if ("zoomed_quadrant" in props) {
            svg.attr("viewBox", viewbox(props.zoomed_quadrant));
        } else {
            radar.attr("transform", translate(width / 2, height / 2));
        }
        
        var grid = radar.append("g");
        
        // draw grid lines
        grid.append("line")
            .attr("x1", 0).attr("y1", -400)
            .attr("x2", 0).attr("y2", 400)
            .style("stroke", colors.grid)
            .style("stroke-width", 1);
        grid.append("line")
            .attr("x1", -400).attr("y1", 0)
            .attr("x2", 400).attr("y2", 0)
            .style("stroke", colors.grid)
            .style("stroke-width", 1);

            // background color. Usage `.attr("filter", "url(#solid)")`
            // SOURCE: https://stackoverflow.com/a/31013492/2609980
        var defs = grid.append("defs");
        var filter = defs.append("filter")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", 1)
            .attr("id", "solid");
        filter.append("feFlood")
            .attr("flood-color", "rgb(0, 0, 0, 0.8)");
        filter.append("feComposite")
            .attr("in", "SourceGraphic");
        
            // draw rings
        for (var i = 0; i < rings.length; i++) {
            grid.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", rings[i].radius)
                .style("fill", "none")
                .style("stroke", colors.grid)
                .style("stroke-width", 1);
            if (print_layout) {
                grid.append("text")
                .text(ringsDefined[i].name)
                .attr("y", -rings[i].radius + 62)
                .attr("text-anchor", "middle")
                .style("fill", ringsDefined[i].color)
                .style("opacity", 0.35)
                .style("font-family", "Arial, Helvetica")
                .style("font-size", "42px")
                .style("font-weight", "bold")
                .style("pointer-events", "none")
                .style("user-select", "none");
            }
        }
        // title
        radar.append("text")
          .attr("transform", translate(title_offset.x, title_offset.y))
          .text(title)
          .style("font-family", "Arial, Helvetica")
          .style("font-size", "30")
          .style("font-weight", "bold")

        // date
        radar
          .append("text")
          .attr("transform", translate(title_offset.x, title_offset.y + 20))
          .text(date || "")
          .style("font-family", "Arial, Helvetica")
          .style("font-size", "14")
          .style("fill", "#999")

        // footer
        radar.append("text")
          .attr("transform", translate(footer_offset.x, footer_offset.y))
          .text("▲ moved up     ▼ moved down")
          .attr("xml:space", "preserve")
          .style("font-family", "Arial, Helvetica")
          .style("font-size", "10px");

        // legend
        var legend = radar.append("g");
        for (var quadrant = 0; quadrant < 4; quadrant++) {
          legend.append("text")
            .attr("transform", translate(
                legend_offset[quadrant].x,
                legend_offset[quadrant].y - 45
            ))
            .text(quadrantsDefined[quadrant].name)
            .style("font-family", "Arial, Helvetica")
            .style("font-size", "18px")
            .style("font-weight", "bold");
          for (var ring = 0; ring < 4; ring++) {
              legend.append("text")
                .attr("transform", legend_transform(quadrant, ring))
                .text(ringsDefined[ring].name)
                .style("font-family", "Arial, Helvetica")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("fill", ringsDefined[ring].color);
              legend.selectAll(".legend" + quadrant + ring)
                .data(segmented[quadrant][ring])
                .enter()
                  .append("a")
                    // .attr("href", function (d, i) {
                    // return d.link ? d.link : "#"; // stay on same page if no link was provided
                    // })
                    // // Add a target if (and only if) there is a link and we want new tabs
                    // .attr("target", function (d, i) {
                    // return (d.link && links_in_new_tabs) ? "_blank" : null;
                    // })
                  .append("text")
                    .attr("transform", function(d, i) { return legend_transform(quadrant, ring, i); })
                    .attr("class", "legend" + quadrant + ring)
                    .attr("id", function(d, i) { return "legendItem" + d.id; })
                    .text(function(d, i) { return d.id + ". " + d.label; })
                    .style("font-family", "Arial, Helvetica")
                    .style("font-size", "11px")
                    .on("mouseover", function(e,d) { showBubble(d); highlightLegendItem(d); })
                    .on("mouseout", function(e,d) { hideBubble(d); unhighlightLegendItem(d); })
                    //enable selection with legend
                    .on("click",function(e,d){onSelected(d);})
            }
          }
        

        var rink = radar.append("g")
            .attr("id", "rink");    
    
        // rollover bubble (on top of everything else)
        var bubble = radar.append("g")
            .attr("id", "bubble")
            .attr("x", 0)
            .attr("y", 0)
            .style("opacity", 0)
            .style("pointer-events", "none")
            .style("user-select", "none");
        bubble.append("rect")
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "#333");
        bubble.append("text")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .style("fill", "#fff");
        bubble.append("path")
            .attr("d", "M 0,0 10,0 5,8 z")
            .style("fill", "#333");
    


        var blips = rink.selectAll(".blip")
        .data(props.entries)
        .enter()
            .append("g")
                .attr("class", "blip")
                .attr("transform", function(d, i) { return legend_transform(d.quadrant, d.ring, i); })
                .on("mouseover", function(e,d) { showBubble(d); highlightLegendItem(d); })
                .on("mouseout", function(e,d) { hideBubble(d); unhighlightLegendItem(d); });
    
        // propsure each blip
        blips.each(function(d) {
            var blip = d3.select(this);
    
            // blip link
            // if (d.active && Object.prototype.hasOwnProperty.call(d, "link") && d.link) {
            //     blip = blip.append("a")
            //     .attr("xlink:href", d.link);
        
            //     if (links_in_new_tabs) {
            //     blip.attr("target", "_blank");
            //     }
            // }
  
            // blip shape
            if (d.moved > 0) {
                blip.append("path")
                .attr("d", "M -11,5 11,5 0,-13 z") // triangle pointing up
                .style("fill", d.color)
                .on("click",function(e,d){onSelected(d);});;
            } else if (d.moved < 0) {
                blip.append("path")
                .attr("d", "M -11,-5 11,-5 0,13 z") // triangle pointing down
                .style("fill", d.color)
                .on("click",function(e,d){onSelected(d);});
            } else {
                blip.append("circle")
                .attr("r", 9)
                .attr("fill", d.color)
                .on("click",function(e,d){onSelected(d);});
            }
  
           // blip text
            if (d.active || print_layout) {
                var blip_text = print_layout ? d.id : d.label.match(/[a-z]/i);
                blip.append("text")
                .text(blip_text)
                .attr("y", 3)
                .attr("text-anchor", "middle")
                .style("fill", "#fff")
                .style("font-family", "Arial, Helvetica")
                .style("font-size", function(d) { return blip_text.length > 2 ? "8px" : "9px"; })
                .style("pointer-events", "none")
                .style("user-select", "none")
                
            }
        });
        
        // make sure that blips stay inside their segment
        function ticked() {
          blips.attr("transform", function(d) {
              return translate(d.segment.clipx(d), d.segment.clipy(d));
          })
        }


        // distribute blips, while avoiding collisions
        forceSimulation()
            .nodes(props.entries)
            .velocityDecay(0.19) // magic number (found by experimentation)
            .force("collision", 
        forceCollide().radius(12).strength(0.85))
            .on("tick", ticked);   
        
        let startX, startY, currentX, currentY;
        let selectionRect, selectedElements;
        let isMouseDown =false;
    
        // Event listener for mouse down
        d3.select('svg').on('mousedown', function (event) {
          // Get the starting mouse coordinates
          isMouseDown = true;
          const [mouseX, mouseY] = d3.pointer(event);

          // const element = d3.select("svg");
          // console.log("element");
          // console.log(element);
          
          // const svgRect = element.getBoundingClientRect();
          // const [mouseXnew, mouseYnew] = [svgRect.left,svgRect.top];

          
          console.log("mouseX");
          console.log(mouseX);
          console.log("mouseY");
          console.log(mouseY);
          // console.log("mouseXnew");
          // console.log(mouseXnew);
          // console.log("mouseYnew");
          // console.log(mouseYnew);


          startX = currentX = mouseX;
          startY = currentY = mouseY;

          // Create the selection rectangle element
          selectionRect = svg
            .append("rect")
            .attr("class", "selection-rect")
            .attr("x", startX)
            .attr("y", startY)
            .attr("width", 0)
            .attr("height", 0);
        });

        // Event listener for mouse move
        svg.on('mousemove', function (event) {
          // Check if a selection rectangle exists
          if (!isMouseDown) return;
          if (!selectionRect) return;

          // Get the current mouse coordinates
          const [mouseX, mouseY] = d3.pointer(event);
          currentX = mouseX;
          currentY = mouseY;

          // Calculate the dimensions of the selection rectangle
          const width = Math.abs(currentX - startX);
          const height = Math.abs(currentY - startY);
          
          // // if the rectangle is too small
          if (width<15 && height<15) return;
          // Update the position and dimensions of the selection rectangle
          selectionRect.attr("x", Math.min(startX, currentX))
            .attr("y", Math.min(startY, currentY))
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-dasharray", "3 3")
                    
          // Perform the selection based on the rectangle area
          selectedElements = d3.selectAll(".blip")
            .filter(function() {
              const rect = this.getBoundingClientRect()
              //the coordinates of the blips are a bit shifted, this -30 +10 are to adjusted it back.
              const elementX = rect.right; 
              const elementY = rect.bottom;     

              console.log("startX");
              console.log(startX);
              console.log("currentX");
              console.log(currentX);
              console.log("startY");
              console.log(startY);
              console.log("currentY");
              console.log(currentY);

              return (
                elementX >= Math.min(startX, currentX) &&
                elementX <= Math.max(startX, currentX) &&
                elementY >= Math.min(startY, currentY) &&
                elementY <= Math.max(startY, currentY)
              );
            });
        });
        // Event listener for mouse up
        svg.on("mouseup", function(event) {
          isMouseDown=false;

          let selectedData;
        
          try{
            selectedData = Array.from(selectedElements._groups[0])
            .map(element => element.__data__);
          } catch (error) {
            const clickedElement = d3.select(event.target);
            const hasClickListener = clickedElement.on("click") !== undefined;
            if(hasClickListener){
              return props.onSelectSpot([clickedElement._groups[0][0].__data__]);
            };
            

            startX = startY = currentX = currentY = null;
            selectedElements = [];
            selectionRect.remove();

            return props.onSelectSpot([]);
          }
          
          props.onSelectSpot(selectedData)

          // Remove the selection rectangle
          selectionRect.remove();
        });
    }, [props]);

    return (
        <div>
          <svg ref={svgRef}></svg>
        </div>
    );
};




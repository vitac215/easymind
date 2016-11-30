var margin = {top: 50, right: 120, bottom: 20, left: 550},
    width = 100,
    height = 700 - margin.top - margin.bottom,
    i = 0;

var h = 35, w = 100, rx = 10, ry = 10;

// Set non-fixed tree size so elements don't get overlapped
var tree = d3.layout.tree()
    .nodeSize([w + 5, h]);

var root = {
    "name": "Concept",
    "id": 1,
    "x": 0,
    "y": 0,
    "width": w*1.3,
    "color": "#fff",
    "text_bold": false,
    "text_italic": false,
    "text_color": "black"
    };

var nodes = tree(root);

// Set the initial id
var id = 2; 

// Set the parent x and y for all nodes, check
nodes.forEach( function(node) {
    if (node.id == 1) {
        node.px = node.x = 500;
        node.py = node.y = 304;
    } else {
        node.px = node.parent.x;
        node.py = node.parent.y;
    }
});

var diagonal = d3.svg.diagonal()
    .projection(function(d) { 
        return [d.x, d.y]; 
    });

// Draggable setting
var dragmove = d3.behavior.zoom()
      .scaleExtent([.5, 10])
      .on("zoom", zoom)
      .translate([margin.left, margin.top]);

function zoom() {
     svg.attr("transform", "translate("+ (d3.event.translate[0]) + "," + (d3.event.translate[1])  +")scale(" + d3.event.scale + ")");
}

// Set container and svg canvas
var container = d3.select("body").append("svg")
        .attr("width", width + "%")
        .attr("height", height + margin.top + margin.bottom)
        .call(dragmove)
        .on("dblclick.zoom", null);

var svg = container.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  // locaiton of initial node


var node = svg.selectAll(".node");
var link = svg.selectAll(".link");

// Reset zoom function
d3.select("#reset").on("click", reset);

// Reset function
function reset() {
    svg.transition()
        .duration(500)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" +" scale(1)");
    dragmove.scale(1);
    dragmove.translate([margin.left, margin.top]);
}

// An array to keep track of the nodes' text width 
var textWidthArray = [];
textWidthArray.push(w);

update(root, false);

// Main function for drawing 
function update(root, condition) {
    // If text is being updated, reconstruct the tree so node width can be updated
    if (condition == true) {
        // Sort the array to find the largest text width
        textWidthArray.sort(function(a,b) {
            return a - b;
        });
        var largest = textWidthArray.slice(-1)[0];
        // Clear the tree for reconstructing
        svg.selectAll("*").remove();
        // Update tree's nodeSize so no nodes overlapped
        tree = d3.layout.tree()
            .nodeSize([largest + 5, h]);
    }

    // Set duration for transition
    var duration1 = 500;
    var duration2 = 1000;

    // Assign nodes and links
    var node = svg.selectAll(".node"); 
    var link = svg.selectAll(".link");

    // Compute the new tree layout
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    // Normalize fixed-depth and update the nodes
    node = node.data(nodes, function(d) { 
        d.y = d.depth * 80; 
        return d.id || (d.id = ++i); 
    });
    link = link.data(links, function(d) { 
        return d.source.id + "-" + d.target.id; 
    });

    // Set node
    var nodesEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";  
        })
        .attr("id", function(d) {
            return d.id;
        })
        .attr("width", function(d) {
            return d.width;
        });

    // Add circles
    var circlesGroup = nodesEnter.append('g')
        .attr('class','circles');

    // Add main circle
    var mainCircles = circlesGroup.append("rect")
        .attr('class','main')
        // .attr("r", 15)
        .attr("x", function(d) {
            return -d.width/2;
        })
        .attr("y", -h/2)
        .attr("width", function(d) {
            return d.width;
        })
        .attr("height", h)
        .attr("rx", rx)
        .attr("ry", ry)
        .style('fill', function(d) {
            return d.color;
        })
        .on("click", select_highlight);

    // Add delete button (red)
    circlesGroup.append("circle")
        .attr('class','delete')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill','#801f0c')
        .attr('opacity', 0.8)
        .attr("r", 0);

    // Add add button (green)
    circlesGroup.append("circle")
        .attr('class','add')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill','#1f800c')
        .attr('opacity', 0.8)
        .attr("r", 0); 

    // Add label text
    nodesEnter.append('g')
        .attr('class', 'label')
        .append('text')
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { 
                return d.name; 
            })
            .attr("font-size", "17px")
            .attr("font-weight", function(d) {
                if (d.text_bold == true) {
                    return "bold";
                } else {
                    return "normal";
                }
            })
            .attr("font-style", function(d) {
                if (d.text_italic == true) {
                    return "italic";
                } else {
                    return "normal";
                }
            })
            .attr("fill", function(d) {
                return d.text_color;
            })
            .call(make_editable, function(d) { 
                return d.name; 
            });

    // Make the root node larger with larger font
    var rootNode = d3.select('.node');
    rootNode.select('.circles .main')
        .attr("x", -root.width/2)
        .attr("y", -h*1.3/2)
        .attr("width", root.width)
        .attr("height", h*1.3)
        .attr("rx", rx)
        .attr("ry", ry)
    rootNode.select('text')
        .attr("font-size", "20px")
        .attr("font-weight", function(d) {
            if (d.text_bold == true) {
                return "bold";
            } else {
                return "normal";
            }
        })
        .attr("font-style", function(d) {
            if (d.text_italic == true) {
                return "italic";
            } else {
                return "normal";
            }
        })
        .attr("fill", function(d) {
            return d.text_color;
        })
        .text(function(d) {
            return d.name;
        });
    rootNode.select('.circles .delete').remove();

    // Hover onto the node, display the add and delete button
    nodesEnter.on("mouseenter", function() {
        var elem = this.__data__; 
        elem1 = d3.selectAll(".delete").filter(function(d, i) { 
            return elem.id == d.id ? this : null;
            // (condition) ? [true path] : [false path];
        });
        elem2 = d3.selectAll(".add").filter(function(d, i) { 
            return elem.id == d.id ? this : null;
        });

        elem2.transition()
          .duration(duration1)
          .attr('cx', -20)
          .attr('cy', 27)
          .attr("r", 10); 

        elem1.transition()
          .duration(duration1)
          .attr('cx', 20)
          .attr('cy', 27)
          .attr("r", 10); 
    }); 

    nodesEnter.on("mouseleave", function() {
        var elem = this.__data__;   // When data is assigned to an element, it is stored in the property __data__
        elem1 = d3.selectAll(".delete").filter(function(d,i) { 
            return elem.id == d.id ? this : null;
        });
        elem2 = d3.selectAll(".add").filter(function(d,i) { 
            return elem.id == d.id ? this : null;
        });

        elem2.transition()
          .duration(duration1)
          .attr('cy', 0)
          .attr('cx', 0)
          .attr("r", 0); 
          
        elem1.transition()
          .duration(duration1)
          .attr('cy', 0)
          .attr('cx', 0)
          .attr("r", 0); 
    }); 


    // Set links
    // Add links from the parent's old position
    var linkEnter = link.enter()
      .insert("path", '.node')
      .attr("class", "link")
      .attr("d", diagonal);

    // Link new nodes to new position
    var trans = svg.transition().duration(duration2);
    trans.selectAll(".link")
        .attr("d", diagonal);
    trans.selectAll(".node")
        .attr("transform", function(d) {
            d.px = d.x; 
            d.py = d.y; 
            return "translate(" + d.x + "," + d.y + ")"; 
        });

    // Delete node
    node.select('.delete').on('click', function() {
        deleteNode(this);
    });

    // Add node
    node.select('.add').on('click', function() { 
        addNode(this);
    });

    node.exit().remove(); 
    link.exit().remove();

    link.transition()
    .duration(duration2).attr("d", diagonal); 
} // end of update()


// Add keyboard support to delete node
d3.select('body')
    .on("keydown", function() {
        var e = d3.event;
        if (e.keyCode == 46 || e.keyCode == 8) {
            // Get the selected node
            var node = d3.select('.main[selected*="selected"]')[0][0];
            if (!node) {
                return;
            }
            deleteNode(node);
        }
    });

// Delete node and its children
function deleteNode(thisObj) {
    // Get the node that the delete button is bind to
    var p = thisObj.__data__; 
    if(p.id != 1) {
        deleteChildNode(p);
        var childArray = p.parent.children;
        childArray = childArray.splice(childArray.indexOf(p), 1);

        update(root, true);
    }
    function deleteChildNode(p) {
        removeWidth(p.width);
        if (!p.children) {
            if (p.id) { 
                p.id = null; 
            }
            return p; 
        } else {
            for (var i = 0; i < p.children.length; i++) {
                p.children[i].id == null; 
                deleteChildNode(p.children[i]); 
            }
            p.children = null;
            return p; 
        }
    }
}; 

// Add a new node
function addNode(thisObj) {
    var p = thisObj.__data__;
    var addedId = id++; 
    var d = {name: 'Sub' + (addedId - 1)};  
    d.id = addedId;
    if (p.children) { 
        p.children.push(d); 
    } else { 
        p.children = [d]; 
    } 
    d.px = p.x;
    d.py = p.x;
    d.width = w;
    d.color = "#fff";
    d.text_bold = false;
    d.text_italic = false;
    d.text_color = "black";
    d3.event.preventDefault();

    textWidthArray.push(d.width);

    update(root, false);
}

// Calculate and get the current text size, update the node width if necessary
function updateNodeWidth(d) {
    // Get the current node's new text width
    var textNode = d3.select('[id="' + d.id + '"]').select('.label').select('text').node();
    var textWidth = textNode.getBBox().width;

    removeWidth(d.width);
    d.width = textWidth + 40;

    // Update the text width to the text width array
    textWidthArray.push(d.width);
}

// Remove a specific text width from textWidthArray
function removeWidth(width) {
    var i = textWidthArray.indexOf(width);
    if (i != -1) {
        textWidthArray.splice(i, 1);
    }
}

// Highlight node when selected
function select_highlight(d) {
    d3.selectAll('.main')
        .style('stroke', 'steelblue')
    // Highlight the selected node
    d3.select('[id="' + d.id + '"]').select('.circles .main')
        .style('stroke', '#ffb3b3')
}

// Parse string and get numbers in it in an array
function parseStr(str) {
    var raw_array = str.match(/[+-]?\d+(\.\d+)?/g);
    var array = new Array(raw_array.length);
    for (i = 0; i < raw_array.length; i++) {
        array[i] = parseFloat(raw_array[i]);
    }
    // If scale is not defined, set it to be 1
    if (!array[2]) {
        array[2] = 1;
    }
    return array;
}

// Edit text
// Adpted from: https://gist.github.com/GerHobbelt/2653660
function make_editable(d, field) {
    this
    .on("click", function(d) {
        // Highlight the selected node
        select_highlight(d);

        // Clear any previous text boxes
        if (d3.selectAll("foreignObject")) {
            d3.selectAll("foreignObject").remove();
        }


        var p = this.parentNode.parentNode.parentNode;

        var xy = this.getBBox();
        // var p_xy = p.getBBox();

        // xy.x = p_xy.x;
        // xy.y = p_xy.y;

        var el = d3.select(this);
        // var p_el = d3.select(p);

        // Get the transformation data
        var str = svg.attr("transform");
        var t_array = parseStr(str);
        var t_x = t_array[0];
        var t_y = t_array[1];
        var t_scale = t_array[2];

        // var frm = p_el.append("foreignObject");
        var frm = d3.select('svg').append("foreignObject");

        var inp = frm
                // .attr("transform", "translate(" + d.x + "," + d.y + ")")
                // .attr("transform", "translate("+ (t_array[0]) + "," + (t_array[1])  +")scale(" + t_array[2] + ")")
                // .attr("x", 150)
                // .attr("y", 10)
                // .attr("x", xy.x)
                // .attr("y", xy.y)
                // .attr("x", xy.x + d.px - d.width/4)
                // .attr("y", xy.y + d.py)
                .attr("x", function() {
                    var x;
                    if (d.id == 1) {
                        x = ((xy.x + d.px - d.width/6)*t_scale + t_x);
                    } else {
                        x = ((xy.x + d.px - d.width/4)*t_scale + t_x);
                    }
                    return x;
                })
                .attr("y", ((xy.y + d.py)*t_scale + t_y) )
                .attr("width", 300)
                .attr("height", 25)
                .append("xhtml:form")
                .append("input")
                .attr("value", function() {
                    this.focus();
                    return d.name;
                })
                .attr("style", "width: " + d.width*0.9*t_scale + "px; height: " + (20*t_scale) + "px; min-height: 15px; color: black; font-size: " + (15*t_scale) +"px; font-weight: normal; overflow: hidden;")
                // Remove the form when you jump out (form looses focus) or hit ENTER:
                .on("blur", function() {
                    var txt = inp.node().value;
                    d[field] = txt;

                    var textChanged = true;
                    if (d.name == txt) {
                        textChanged = false;
                    }

                    d.name = txt;

                    if (txt !== null && txt !== "") {
                        // If d is root
                        if (d.id == 1) {
                            root = d;
                        }

                        // Remove the whole form box
                        d3.selectAll("foreignObject").remove();

                        if (textChanged == true) {
                            // Update tree, wait until the text is updated
                            update(root, true);

                            // Update node's width
                            updateNodeWidth(d);

                            // Update tree
                            update(root, true);
                        }
                    }

                })
                .on("keypress", function() {
                    // IE fix
                    if (!d3.event) {
                        d3.event = window.event;
                    }

                    var e = d3.event;
                    if (e.keyCode == 13) {
                        if (typeof(e.cancelBubble) !== 'undefined') // IE
                            e.cancelBubble = true;
                        if (e.stopPropagation)
                            e.stopPropagation();
                        e.preventDefault();

                        var txt = inp.node().value;

                        var textChanged = true;
                        if (d.name == txt) {
                            textChanged = false;
                        }

                        d.name = txt;

                        if (txt !== null && txt !== "") {
                            d[field] = txt;
                            el.text(function(d) { 
                                return d[field]; 
                            });

                            if (d3.selectAll("foreignObject").parentNode) {
                                d3.selectAll("foreignObject").remove();
                            }

                            if (textChanged == true) {
                                // Update tree, wait until the text is updated
                                update(root, true);

                                // Update node's width
                                updateNodeWidth(d);

                                // Update tree
                                update(root, true);
                            }

                        }
                    }
                });
    });
}
var margin = {top: 50, right: 120, bottom: 20, left: 300},
    width = 100,
    height = 500 - margin.top - margin.bottom,
    i = 0;

var tree = d3.layout.tree()
        .size([height, width]);

var root = {
    "name": "Concept",
    "id": 1
    };

var nodes = tree(root);

// Check
var id = ++nodes.length; 

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

var svg = d3.select("body").append("svg")
        .attr("width", width + "%")
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var node = svg.selectAll(".node");
var link = svg.selectAll(".link");


update(root);


function update(root) {

    var duration1 = 500;
    var duration2 = 1000;

    // Assign nodes and links
    var node = svg.selectAll(".node"); 
    var link = svg.selectAll(".link");

    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    // Define depth and id
    node = node.data(nodes, function(d) { 
        d.y = d.depth * 100; 
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

    // Add label text
    nodesEnter.append('g')
        .attr('class', 'label')
        .append('text')
        .attr("y", -23)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { 
            return d.name; 
        })
        .call(make_editable, function(d) { 
            return d.name; 
        });

    // Add circles
    var circlesGroup = nodesEnter.append('g')
        .attr('class','circles');

    // Add main circle
    var mainCircles = circlesGroup.append("circle")
        .attr('class','main')
        .attr("r", 15);

    circlesGroup.append("circle")
        .attr('class','delete')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill','#801f0c')
        .attr('opacity',0.8)
        .attr("r", 0);

    circlesGroup.append("circle")
        .attr('class','add')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill','#1f800c')
        .attr('opacity',0.8)
        .attr("r", 0);  

    // Hover onto the node, display add and delete buttons
    circlesGroup.on("mouseenter", function() {
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
          .attr('cy', 20)
          .attr("r", 8); 

        elem1.transition()
          .duration(duration1)
          .attr('cx', 20)
          .attr('cy', 20)
          .attr("r", 8); 
    }); 

    circlesGroup.on("mouseleave", function() {
        var elem = this.__data__; 
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
        var p = this.__data__; 
        if(p.id != 1) {
            deleteNode(p);
            var childArray = p.parent.children;
            childArray = childArray.splice(childArray.indexOf(p), 1);

            update(root);
        }
        function deleteNode(p) {
            if (!p.children) {
                if (p.id) { 
                    p.id = null; 
                }
                return p; 
            } else {
                for(var i = 0; i < p.children.length; i++) {
                    p.children[i].id == null; 
                    deleteNode(p.children[i]); 
                }
                p.children = null;
                return p; 
            }
        }
    }); 


    // Add node
    node.select('.add').on('click', function() { 
        var p = this.__data__;
        var addedId = id++; 
        var d = {name: 'Sub' + addedId};  
        d.id = addedId;
        if (p.children) { 
            p.children.push(d); 
        } else{ 
            p.children = [d]; 
        } 
        d.px = p.x;
        d.py = p.x;
        d3.event.preventDefault();

        update(root);
    });

    node.exit().remove(); 
    link.exit().remove();

    link.transition()
    .duration(duration2).attr("d", diagonal); 
}


function make_editable(d, field) {
    this.on("mouseover", function() {
        d3.select(this).style("fill", "red");
    })
    .on("mouseout", function() {
        d3.select(this).style("fill", null);
    })
    .on("click", function(d) {
        var p = this.parentNode;
        // inject a HTML form to edit the content here...

        // bug in the getBBox logic here, but don't know what I've done wrong here;
        // anyhow, the coordinates are completely off & wrong. :-((
        var xy = this.getBBox();
        var p_xy = p.getBBox();

        xy.x = p_xy.x;
        xy.y = p_xy.y;

        var el = d3.select(this);
        var p_el = d3.select(p);

        var frm = p_el.append("foreignObject");

        var inp = frm
                .attr("x", xy.x)
                .attr("y", xy.y)
                .attr("width", 300)
                .attr("height", 25)
                .append("xhtml:form")
                .append("input")
                .attr("value", function() {
                    // nasty spot to place this call, but here we are sure that the <input> tag is available
                    // and is handily pointed at by 'this':
                    this.focus();
                    return d[field];
                })
                .attr("style", "width: 120px;")
                // make the form go away when you jump out (form looses focus) or hit ENTER:
                .on("blur", function() {
                    var txt = inp.node().value;
                    if(txt !== null && txt !== "")
                    {
                        d[field] = txt;
                        el.text(function(d) { return d[field]; });
                        // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
                        //p_el.select("foreignObject").remove();
                        // Borra el Input al salir
                        inp.remove();
                    }
                })
                .on("keypress", function() {
                    // IE fix
                    if (!d3.event)
                        d3.event = window.event;

                    var e = d3.event;
                    if (e.keyCode == 13)
                    {
                        if (typeof(e.cancelBubble) !== 'undefined') // IE
                            e.cancelBubble = true;
                        if (e.stopPropagation)
                            e.stopPropagation();
                        e.preventDefault();

                        var txt = inp.node().value;

                        if(txt !== null && txt !== "")
                        {
                            d[field] = txt;
                            el.text(function(d) { return d[field]; });

                            // odd. Should work in Safari, but the debugger crashes on this instead.
                            // Anyway, it SHOULD be here and it doesn't hurt otherwise.
                            //p_el.select("foreignObject").remove();
                            // Borra el Input al salir
                            frm.remove();
                        }
                    }
                });
    });
}
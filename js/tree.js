var margin = {top: 50, right: 120, bottom: 20, left: 300},
    width = 100,
    height = 500 - margin.top - margin.bottom,
    i = 0;

var tree = d3.layout.tree()
        .size([height, width]);

var root = {"name":"Concept"},
        nodes = tree(root);

root.parent = null;
root.px = root.x;  // previous x = current y
root.py = root.y;  // previous y = current y

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


update();


function update() {

    // Assign nodes
    var nodes = tree.nodes(root);

    // Define depth and id
    node = node.data(nodes, function(d) { 
        d.y = d.depth * 100; 
        return d.id || (d.id = ++i); 
    });

    // Enter the nodes
    var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("id", function(d){
                return d.id;
            })
            .attr("parent", function(d){
                return d.parent ? d.parent.id : null;
                // (condition) ? [true path] : [false path];
            })
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            });

    // Append nodes
    nodeEnter.append("circle")
            .attr("r", 15)
            .style("fill", "#fff");

    // Append minus button
    nodeEnter.append("circle")
            .attr("class", "plus")
            .attr("cx", "-18px")
            .attr("cy", "18px")
            .attr("r", 10)
            .style("fill", "#1F800C")
            .call(add_node, "name");

    // Append plus button
    nodeEnter.append("circle")
            .attr("class", "minus")
            .attr("cx", "18px")
            .attr("cy", "18px")
            .attr("r", 10)
            .style("fill", "#801f0c")
            .call(delete_node);

    // Append label text
    nodeEnter.append("text")
            .attr("y", -25)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) { 
                return d.name; 
            })
            .style("fill-opacity", 1)
            .call(make_editable, "name");


    // Assign links
    var links = tree.links(nodes);

    // Define link
    link = link.data(links, function(d) { 
        return d.source.id + "-" + d.target.id; 
    });

    // Append links from the parent’s old position.
    link.enter().insert("path", ".node")
            .attr("class", "link")
            .attr("d", diagonal);

    // Link new nodes to new position
    var trans = svg.transition();
    trans.selectAll(".link")
            .attr("d", diagonal);
    trans.selectAll(".node")
            .attr("transform", function(d) {
                d.px = d.x; 
                d.py = d.y; 
                return "translate(" + d.x + "," + d.y + ")"; 
            });

}

// function add_node(d) {
//     this.on("click", function(d) {
//         if (d.id != 1) {
//             var newNode = {"name": "Sub-concepts"};
//             var p = nodes[0];
//             if (d.children) {
//                 d.children.push(newNode);
//             } else {
//                 d.children = [newNode];
//             }
//             update();
//         }
//     });
// }

// function delete_node(d) {
//     this.on("click", function(d){
//         console.log(d);
//         $('.node[id='+d.id+']').each(function(){
//             console.log('path#'+$(this).attr("id"));
//             $('path#'+$(this).attr("id")).fadeOut("fast").remove();
//             $(this).fadeOut("fast", function(e){
//                 this.remove();
//             });
//             delete_children($(this).attr("id"));
//         });
//         update();
//     });
// }

// function delete_children(id) {
//     $('.node[parent='+id+']').each(function(){
//         $('path#'+$(this).attr("id")).fadeOut("fast").remove();
//         $(this).fadeOut("fast", function(e){
//             this.remove();
//         });
//         //delete_all_childs($(this).attr("id"));
//     });
// }

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
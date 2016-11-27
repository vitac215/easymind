function tree(){
	// Define the initial property
	// ws: width space
	var svgW = 1000, svgH = 1000, vRad = 20, tree = {x:500, y:50, w: 150, h: 50, rx: 15, ry: 15, ws:130, hs:100};

	// Define the initial node property
	tree.vis = {
		v:0, 
		l:'Concept', 
		p:{x: tree.x - tree.w/2, y: tree.y - tree.h/2, lx: tree.x, ly: tree.y, w: tree.w, h: tree.h, rx: tree.rx, ry: tree.ry},  // property: position (x, y) and size (w, h, rx, ry)
		c:[]
	};	

	// Define the initial tree size
	tree.size = 1;
	
	tree.getVertices = function(){
		// console.log("getVertices");
		var vertices =[];
		function getVertices(treeNode, parentNodeProperty){	
			vertices.push({
				v: treeNode.v, 
				l: treeNode.l, 
				p: treeNode.p, 
				f: parentNodeProperty
			});	
			treeNode.c.forEach(function(d){ 
				return getVertices(d, {v: treeNode.v, p: treeNode.p}); 
			});
		}
		getVertices(tree.vis, {});
		// Sort by ascending order by vertex
		return vertices.sort(function(a, b){ 
			return a.v - b.v;
		}); 
	}
	
	tree.getEdges =  function(){
		// console.log("getEdges");
		var edges =[];
		function getEdges(treeNode){
			treeNode.c.forEach(function(d){ 
				edges.push({
					v1: treeNode.v, // original node
					l1: treeNode.l, 
					p1: treeNode.p, 
					v2: d.v,  		// new child node
					l2: d.l, 
					p2: d.p
				});
			});
			treeNode.c.forEach(getEdges);
		}
		getEdges(tree.vis);
		return edges.sort(function(a, b){ 
			return a.v2 - b.v2;
		});	
	}
	
	tree.addLeaf = function(v){
		console.log("addLeaf");
		function addLeaf(treeNode){
			if (treeNode.v == v) { 
				treeNode.c.push({
					v: tree.size++, 
					l: 'Sub', 
					p: {}, 
					c: []
				}); 
				return; 
			}
			treeNode.c.forEach(addLeaf);
		}
		addLeaf(tree.vis);
		reposition(tree.vis);
		redraw();
	}

	tree.addButton = function(v){
		console.log("addButton")
	}
	
	redraw = function(){
		console.log("redraw");
		var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
		
		edges.transition().duration(500)
			.attr('x1',function(d) { 
				return d.p1.lx; 
			})
			.attr('y1',function(d) { 
				return d.p1.ly;
			})
			.attr('x2',function(d) { 
				return d.p2.lx;
			})
			.attr('y2',function(d) { 
				return d.p2.ly;
			})
	
		edges.enter().append('line')
			.attr('x1',function(d) { 
				return d.p1.lx;
			})
			.attr('y1',function(d) { 
				return d.p1.ly;
			})
			.attr('x2',function(d) { 
				return d.p1.lx;
			})
			.attr('y2',function(d){ 
				return d.p1.ly;
			})
			.transition().duration(500)
			.attr('x2',function(d) { 
				return d.p2.lx;
			})
			.attr('y2',function(d){ 
				return d.p2.ly;
			});
			
		var nodes = d3.select("#g_nodes").selectAll('rect').data(tree.getVertices());

		nodes.transition().duration(500)
			   .attr('x',function(d){ 
			   		return d.p.x;
			   	})
			   .attr('y',function(d){ 
			   		return d.p.y;
			   	})
			   .attr('width',function(d){ 
					return d.p.w;
				})
				.attr('height',function(d){ 
					return d.p.h;
				})
				.attr('rx', function(d){ 
					return d.p.rx;
				})
				.attr('ry', function(d){ 
					return d.p.ry;
				});
		
		nodes.enter().append('rect')
			   .attr('x',function(d){ 
			   		return d.f.p.x;
			   	})
			   .attr('y',function(d){ 
			   		return d.f.p.y;
			   	})
				.attr('width',function(d){ 
					return d.f.p.w;
				})
				.attr('height',function(d){ 
					return d.f.p.h;
				})
				.attr('rx', function(d){ 
					return d.f.p.rx;
				})
				.attr('ry', function(d){ 
					return d.f.p.ry;
				})
			   // Click on the node to add a new one
			   .on('click',function(d){
			   		return tree.addLeaf(d.v);
			   	})
			   .transition().duration(500)
			   		.attr('x',function(d){ 
			   			return d.p.x;
			   		})
			   		.attr('y',function(d){ 
			   			return d.p.y;
			   		})
					.attr('width',function(d){ 
						return d.p.w;
					})
					.attr('height',function(d){ 
						return d.p.h;
					})
					.attr('rx', function(d){ 
						return d.p.rx;
					})
					.attr('ry', function(d){ 
						return d.p.ry;
					});

			
		// Label text
		var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices());
		
		labels.text(function(d){
				return d.l;
			})
			.transition().duration(500)
				.attr('x',function(d){ 
					// console.log(d.p);
					return d.p.lx;
				})
				.attr('y',function(d){ 
					return d.p.ly + 5;
				});
			
		labels.enter().append('text')
			.attr('x',function(d){ 
				return d.f.p.lx;  
			})
			.attr('y',function(d){ 
				return d.f.p.ly + 5;
			})
			.text(function(d){
				return d.l;
			})
			.on('click',function(d){
				return tree.addLeaf(d.v);
			})
			.transition().duration(500)
				.attr('x',function(d){ 
					return d.p.lx;
				})
				.attr('y',function(d){ 
					return d.p.ly + 5;
				});		
	} // end of redraw
	
	getLeafCount = function(_){
		// console.log("getLeafCount");
		if (_.c.length ==0) {
			return 1;
		} else {
			return _.c.map(getLeafCount).reduce(function(a,b){ 
				return a+b;
			});
		}
	}
	
	reposition = function(v){
		console.log("reposition");
		var leafCount = getLeafCount(v)
		var left = v.p.lx - tree.ws*(leafCount-1)/2;
		v.c.forEach(function(d){
			var widthOffset = tree.ws*getLeafCount(d); 
			left+=widthOffset; 
			// Update d.p
			d.p.w = 120;
			d.p.h = 40; 
			d.p.x = left - (widthOffset+tree.ws)/2 - d.p.w/2;
			d.p.y = v.p.ly + tree.hs - v.p.h/2;
			d.p.lx = left - (widthOffset+tree.ws)/2;
			d.p.ly = v.p.y + tree.hs + d.p.h/2;
			d.p.rx = 15;
			d.p.ry = 15;
			// console.log(d.p);
			reposition(d);
		});		
	}	
	
	initialize = function(){
		d3.select("body").append("svg").attr("width", svgW).attr("height", svgH).attr('id','treesvg');

		d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
			.attr('x1',function(d){ 
				return d.p1.x;
			})
			.attr('y1',function(d){ 
				return d.p1.y;
			})
			.attr('x2',function(d){ 
				return d.p2.x;
			})
			.attr('y2',function(d){ 
				return d.p2.y;
			});

		// Draw the initial node
		d3.select("#treesvg").append('g').attr('id','g_nodes').selectAll('rect').data(tree.getVertices()).enter().append('rect')
			.attr('x',function(d){ 
				return d.p.x;
			})
			.attr('y',function(d){ 
				return d.p.y;
			})
			.attr('width',function(d){ 
				return d.p.w;
			})
			.attr('height',function(d){ 
				return d.p.h;
			})
			.attr('rx', function(d){ 
				return d.p.rx;
			})
			.attr('ry', function(d){ 
				return d.p.ry;
			})
			.on('click',function(d){
				return tree.addLeaf(d.v);
			});
		
		// Draw text on the initial node
		d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
			.attr('x',function(d){ 
				return d.p.lx;
			})
			.attr('y',function(d){ 
				return d.p.ly + 5;
			})
			.text(function(d){
				return d.l;
			})
			.on('click',function(d){
				return tree.addLeaf(d.v);
			});	
	}

	initialize();

	return tree;
}

var tree= tree();
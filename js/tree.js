function tree(){
	// Define the initial property
	var svgW = 1000, svgH = 1000, vRad = 20, tree = {cx:500, cy:30, w:100, h:100};

	// Define the initial node property
	tree.vis = {v:0, l:'Concept', p:{x:tree.cx, y:tree.cy}, c:[]};	
	// Define the initial tree size
	tree.size = 1;
	
	tree.getVertices = function(){
		var vertices =[];
		function getVertices(treeNode, family){	
			vertices.push({
				v: treeNode.v, 
				l: treeNode.l, 
				p: treeNode.p, 
				f: family
			});	
			treeNode.c.forEach(function(d){ 
				return getVertices(d, {v:treeNode.v, p:treeNode.p}); 
			});
		}
		getVertices(tree.vis, {});
		// Sort by ascending order by vertex
		return vertices.sort(function(a, b){ 
			return a.v - b.v;
		}); 
	}
	
	tree.getEdges =  function(){
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
	
	tree.addLeaf = function(nodev){
		function addLeaf(treeNode){
			if (treeNode.v == nodev) { 
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
	
	redraw = function(){
		var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
		
		edges.transition().duration(500)
			.attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
			.attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;})
	
		edges.enter().append('line')
			.attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
			.attr('x2',function(d){ return d.p1.x;}).attr('y2',function(d){ return d.p1.y;})
			.transition().duration(500)
			.attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});
			
		var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices());

		circles.transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});
		
		circles.enter().append('circle').attr('cx',function(d){ return d.f.p.x;}).attr('cy',function(d){ return d.f.p.y;}).attr('r',vRad)
			.on('click',function(d){return tree.addLeaf(d.v);})
			.transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});
			
		var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices());
		
		labels.text(function(d){return d.l;}).transition().duration(500)
			.attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;});
			
		labels.enter().append('text').attr('x',function(d){ return d.f.p.x;}).attr('y',function(d){ return d.f.p.y+5;})
			.text(function(d){return d.l;}).on('click',function(d){return tree.addLeaf(d.v);})
			.transition().duration(500)
			.attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;});		
				
		d3.select('#incMatx').selectAll('.incRect')
			.attr('x',function(d,i){ return (d.x+d.y)*tree.incS;}).attr('y',function(d,i){ return d.y*tree.incS;})
			.attr('width',function(){ return tree.incS;}).attr('height',function(){ return tree.incS;})
			.attr('fill',function(d){ return d.f == 1? 'black':'white'});
	}
	
	getLeafCount = function(_){
		if(_.c.length ==0) return 1;
		else return _.c.map(getLeafCount).reduce(function(a,b){ return a+b;});
	}
	
	reposition = function(v){
		var lC = getLeafCount(v), left=v.p.x - tree.w*(lC-1)/2;
		v.c.forEach(function(d){
			var w =tree.w*getLeafCount(d); 
			left+=w; 
			d.p = {x:left-(w+tree.w)/2, y:v.p.y+tree.h};
			reposition(d);
		});		
	}	
	
	initialize = function(){
		d3.select("body").append("svg").attr("width", svgW).attr("height", svgH).attr('id','treesvg');

		d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
			.attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
			.attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});

		d3.select("#treesvg").append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
			.append('circle').attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;}).attr('r',vRad)
			.on('click',function(d){return tree.addLeaf(d.v);});
			
		d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
			.attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;}).text(function(d){return d.l;})
			.on('click',function(d){return tree.addLeaf(d.v);});	
				
	}
	initialize();

	return tree;
}
var tree= tree();
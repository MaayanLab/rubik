define(['d3','underscore','Util','Canvas'],function(d3,_,Util,Canvas){


	var Layout = function(args){
		this.selector = args.selector||'#container';
		this.container = d3.select(this.selector);
		this.gridsPerRow = args.gridsPerRow||2;
		this.addColor = args.addColor;
		this.gridNames = args.gridNames;
		this.grids = args.grids;
		this.enrichments = args.enrichments||undefined;
		this.tags = args.tags||undefined;
		this.labelBox = args.labelBox;

	}


	//private methods:
	var addEnrichment = function(enrichment,grid){
		return _.map(grid,function(tile){
			tile.pval = enrichment[tile.identity].pval;
			tile.count = enrichment[tile.identity].count;
			tile.posPercent = enrichment[tile.identity].posPercent;
			return tile;
		});
	}

	var addTags = function(self){
		var tags =self.tags;
			var pureGridClass = 'pure-u-1-'+(tags.length);
			tags.forEach(function(tag,i){
				var left = (1/tags.length)*100;
				d3.select('body').append('div')
							  .attr('class','tag')
							  .style('width',left.toFixed(1)+'%')
							  .style('left',left.toFixed(1)*i+'%')
							  .text(tag);
			});

		return tags;
	}
	// end of private methods



	var methods = {
		single:function(){
			addTags(this);
			this.container.selectAll('div').data(this.gridNames)
								.enter().append('div')
								.attr('class','pure-u-1-2')
								.each(function(d){
									var holder = d3.select(this);
									holder.append('h4').text(d);
									holder.append('div').attr('name','gridContainer').attr('id',d);
								});

			for(var key in this.grids){
				var grid = this.grids[key];
				grid = addEnrichment(self.enrichments[0][key],grid);
				grid = this.addColor.add(key,grid);
				var canvas = new Canvas({containerID:key,stageSize:300});
				canvas.changeData(grid);
				this.labelBox.listenTo(canvas,'tile.click',this.labelBox.select);
			}

		},

		compare:function(){
			var tags = addTags(this),
			    self = this;
				pureGridClass = 'pure-u-1-'+(tags.length);
			this.gridNames.forEach(function(gridName){
				self.container.append('div')
			 			  .attr('class','pure-u-1-1')
			 			  // .append('hr')
			 			  .append('h4')
			 			  .attr('class','hCompare')
			 			  .text(gridName);
				tags.forEach(function(tag,i){
					var id = tag+'-'+gridName;
					var holder = d3.select(self.selector).append('div')
											.attr('class',pureGridClass)
											.attr('id',id);

					var grid = self.grids[gridName];
					grid = addEnrichment(self.enrichments[i][gridName],grid);
					grid = self.addColor.add(gridName,grid);
					var canvas = new Canvas({containerID:id,stageSize:300});
					canvas.changeData(grid);
					self.labelBox.listenTo(canvas,'tile.click',self.labelBox.select);
				});
			});
		},
	}

	Util.constructClass(Layout,methods);

	return Layout;


});
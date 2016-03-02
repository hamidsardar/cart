(function() {

	angular.module('graphing', ['reporting', 'reasoncodes'])

	 .constant('GRAPHING_COLORS', {
		"New": "#123ABC",
		"In-Progress": "#E0E4CC",
		"Won": "#F38630",
	 	"Lost": "#EF1054",
	 	"Sent": "#0d94c1",
	 	"AMEX": "#6CBAA5",
	 	"MASTERCARD": "#F38630",
	 	"VISA": "#0d94c1",
	 	"DISCOVER": "#E0E4CC",
		"UNIONPAY": "#EF1054",
		"DINERS": "#409352"
	})
	
	.directive('percentage', 
	 	[
		'$window', '$http', '$filter', '$timeout', '$state',
		function($window, $http, $filter, $timeout, $state) {

		return {
			restrict:'EA',
			template: "<div></div>",
			scope: {
				control: '='
			},
			link: function(scope, elem, attrs) {
				
				var	container = elem.find('div'),
					d3 = $window.d3,
					w = container.width(),
					h = container.width(),
					r = container.width()/2 - 15,
					ir = r - 50,
					text_y = ".25em",
					duration = 500,
					percent = 0,
					transition = 200;

				function calcPercent(percent) {
					return [percent, 100-percent];
				}

				var pie = d3.layout.pie().sort(null),
					format = d3.format(".0%");

				var arc = d3.svg.arc()
				.innerRadius(r - 30)
				.outerRadius(r);

				var svg = d3.select(container[0]).append("svg")
					.attr("width", w)
					.attr("height", h)
					.append("g")
					.attr("transform", "translate(" + w / 2 + "," + w / 2 + ")");

				var path = svg.selectAll("path")
					.data(pie([0,100]))
					.enter().append("path")
					.attr("class", function(d, i) { return "color" + i; })
					.attr("d", arc)
					.each(function(d) { this._current = d; }); // store the initial values

				var text = svg.append("text")
					.attr("text-anchor", "middle")
					.attr("dy", text_y);				

				scope.control.update = function(wl) {
					
					var percent = (wl.won / wl.count) * 100;
					
					if (_.isNaN(percent)) {
						return;
					}
					
					var dataset = {
						lower: calcPercent(0),
						upper: calcPercent(percent)
					};
					

					if (typeof(percent) === "string") {
						text.text(percent);
					} else {
						var progress = 0;
						var timeout = setTimeout(function () {
							clearTimeout(timeout);
							path = path.data(pie(dataset.upper)); // update the data
							path.transition().duration(duration).attrTween("d", function (a) {
								// Store the displayed angles in _current.
								// Then, interpolate from _current to the new angles.
								// During the transition, _current is updated in-place by d3.interpolate.
								var i  = d3.interpolate(this._current, a);
								var i2 = d3.interpolate(progress, percent);
								this._current = i(0);
								return function(t) {
									text.text( format(i2(t) / 100) );
									return arc(i(t));
								};
							}); // redraw the arcs
						}, 200);
					}

				};
				
				
			}
		};
	}])			// end percentage pie


	.directive('pie',
		[
		'$window', '$http', '$filter', 'GRAPHING_COLORS', '$timeout', '$state', 'ReportingService',
		function($window, $http, $filter, GRAPHING_COLORS, $timeout, $state, ReportingService) {

		return {
			restrict:'EA',
			template: "<div></div>",
			scope: {
				control: '='
			},
			link: function(scope, elem, attrs) {
				
				var	container = elem.find('div'),
					d3 = $window.d3,
					w = container.width(),
					h = container.width(),
					r = container.width()/2 - 75,
					ir = r - 50,
					textOffset = 14,
					tweenDuration = 250;

				//OBJECTS TO BE POPULATED WITH DATA LATER
				var lines, valueLabels, nameLabels;
				var pieData = [];    
				var oldPieData = [];
				var filteredPieData = [];

				//D3 helper function to populate pie slice parameters from array data
				var volumeDonut = d3.layout.pie().value(function(d){
					return d.sum;
				});

				//D3 helper function to populate pie slice parameters from array data
				var countDonut = d3.layout.pie().value(function(d){
					return d.count;
				});

				

				//D3 helper function to draw arcs, populates parameter "d" in path object
				var arc = d3.svg.arc()
					.startAngle(function(d){ return d.startAngle; })
					.endAngle(function(d){ return d.endAngle; })
					.innerRadius(ir)
					.outerRadius(r);
					

					
			

				///////////////////////////////////////////////////////////
				// CREATE VIS & GROUPS ////////////////////////////////////
				///////////////////////////////////////////////////////////

				var vis = d3.select(container[0]).append("svg:svg")
					//.attr("width", w)
					//.attr("height", h)
					.attr("width", '100%')
					.attr("height", '100%')
					.attr('viewBox','0 0 '+Math.min(w,h)+' '+Math.min(w,h))
					.attr('preserveAspectRatio','xMinYMin');

				//GROUP FOR ARCS/PATHS
				var arc_group = vis.append("svg:g")
					.attr("class", "arc")
					.attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");


				//GROUP FOR LABELS
				var label_group = vis.append("svg:g")
					.attr("class", "label_group")
					.attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

				//GROUP FOR CENTER TEXT  
				var center_group = vis.append("svg:g")
					.attr("class", "center_group")
					.attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

				//PLACEHOLDER GRAY CIRCLE
				var paths = arc_group.append("svg:circle")
					.attr("fill", "#EFEFEF")
					.attr("r", r);

				///////////////////////////////////////////////////////////
				// CENTER TEXT ////////////////////////////////////////////
				///////////////////////////////////////////////////////////

				//WHITE CIRCLE BEHIND LABELS
				var whiteCircle = center_group.append("svg:circle")
					.attr("fill", "white")
					.attr("r", ir);

				// "Report Type" LABEL
				var reportTypeLabel = center_group.append("svg:text")
					.attr("class", "report-type")
					.attr("dy", -25)
					.attr("text-anchor", "middle") // text-align: right
					.text(" ");

				// "TOTAL" LABEL
				var totalLabel = center_group.append("svg:text")
					.attr("class", "label")
					.attr("dy", 0)
					.attr("text-anchor", "middle") // text-align: right
					.text("TOTAL");

				//TOTAL TRAFFIC VALUE
				var totalValue = center_group.append("svg:text")
					.attr("class", "total")
					.attr("dy", 20)
					.attr("text-anchor", "middle") // text-align: right
					.text("Waiting...");

				var countValue = center_group.append("svg:text")
					.attr("class", "pcount")
					.attr("dy", 45)
					.attr("text-anchor", "middle") // text-align: right
					.text("");

				//UNITS LABEL
				// var totalUnits = center_group.append("svg:text")
				// 	.attr("class", "units")
				// 	.attr("dy", 21)
				// 	.attr("text-anchor", "middle") // text-align: right
				// 	.text("kb");

				
				var ctrl = this;
				if (scope.control) {
					ctrl = scope.control;
				}
				ctrl.update = function(res) {

					oldPieData = filteredPieData;
					if (res.data_type == "number") {
						pieData = countDonut(res.data);
					} else {
						pieData = volumeDonut(res.data);
					}

					var sum = 0,
						pcount = 0;
					 _.each(res.data, function(d) {
					 	if (res.data_type == "currency") {
					 		sum += (d.sum);
					 	} else {
					 		sum += d.count;
					 	}
					 	pcount += d.count;
					 });

					scope.colors = {};
					function filterData(element, index, array) {
						element.name = res.data[index].name;
						element.filter = res.filter;
						if (res.data_type == "currency") {
							element.value = res.data[index].sum;
							element.count = res.data[index].count;
							element.pct = (res.data[index].sum) / sum;
						} else {
							element.value = res.data[index].count;
							element.count = res.data[index].count;
							element.pct = (res.data[index].count) / sum;
						}
						
						var ref = element.name;
						if (!ref) { ref = 'null'; }

						element.color = GRAPHING_COLORS[ ref ];
						return (element.value > 0);
					}
					filteredPieData = pieData.filter(filterData);

					//if(filteredPieData.length > 0) {

						//REMOVE PLACEHOLDER CIRCLE
						arc_group.selectAll("circle").remove();

						totalValue.text(function(){
							if (res.data_type == "currency") {
								return $filter('currency')(sum, '$', 2);
							} else {
								return $filter('number')(sum, 0);
							}
						});

						countValue.text(function(){
							var out = $filter('number')(pcount, 0);
							if (pcount == 1) {
								 out += " chargeback";
							} else if (pcount > 1) {
								out += " chargebacks";
							}
							return out;
						});


						reportTypeLabel.text(function() {
							return res.label;
						});
							

						//DRAW ARC PATHS
						paths = arc_group.selectAll("path").data(filteredPieData);
						paths.enter().append("svg:path")
							.attr("stroke", "white")
							.attr("stroke-width", 0.5)
							.attr("fill", function(d, i) {return d.color;})
							.transition()
							.duration(tweenDuration)
							.attrTween("d", pieTween);
						// add mouseover tooltip
						paths.on("mouseover", function (d) {
								
								var tt = '<b>' + d.name + '</b><br/><div>';
								if (res.data_type == "currency") {
									tt += $filter('currency')(d.value, '$', 2);

								} else {
									tt += $filter('number')(d.value);
								}
								tt += " or " + Math.round( d.pct * 100) + '%';
								tt += '</div>';

								d3.select("#tooltip")
									.style("left", (d3.event.pageX - 220) + "px")
									.style("top", (d3.event.pageY - 100) + "px")
									.style("opacity", 1)
									.select('.content')
									.html(tt);
							})
							.on("mouseout", function () {
								// Hide the tooltip
								d3.select("#tooltip")
									.style("opacity", 0);
							})
							.on("click", function(d) {
								var params = {},
									dates = ReportingService.getDates();
								
								console.log(d);
								if (d.filter._id) {
									params[d.filter.name] = d.filter._id;
								} else {
									params[d.filter.name] = d.name;
								}
								params['start'] = dates.start;
								params['end'] = dates.end;

								$state.go('chargebacks', params );
							});
						paths
							.transition()
							.duration(tweenDuration)
							.attr("fill", function(d, i) { return d.color; })
							.attrTween("d", pieTween);
						paths.exit()
							.transition()
							.duration(tweenDuration)
							.attrTween("d", removePieTween)
							.remove();

						//DRAW TICK MARK LINES FOR LABELS
						lines = label_group.selectAll("line").data(filteredPieData.filter(function(d) {
							var percentage = Math.round(d.pct*100);
							if (percentage > 2) {
								return d;
							}
						}));
						lines.enter().append("svg:line")
							.attr("x1", 0)
							.attr("x2", 0)
							.attr("y1", -r-3)
							.attr("y2", -r-8)
							.attr("stroke", "gray")
							.attr("transform", function(d) {
								return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
							});
						lines.transition()
							.duration(tweenDuration)
							.attr("transform", function(d) {
								return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
							});
						lines.exit().remove();

						

						//DRAW LABELS WITH PERCENTAGE VALUES
						valueLabels = label_group.selectAll("text.value").data(filteredPieData)
							.attr("dy", function(d){
								if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
									return 5;
								} else {
									return -7;
								}
							})
							.attr("text-anchor", function(d){
								if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
									return "beginning";
								} else {
									return "end";
								}
							})
							.text(function(d){
								var percentage = Math.round(d.pct*100);
								if (percentage > 2) {
									return percentage + "%";
								} else {
									return '';
								}
							});

						valueLabels.enter().append("svg:text")
							.attr("class", "value")
							.attr("transform", function(d) {
								return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (r+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (r+textOffset) + ")";
							})
							.attr("dy", function(d){
								if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
									return 5;
								} else {
									return -7;
								}
							})
							.attr("text-anchor", function(d){
								if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
									return "beginning";
								} else {
									return "end";
								}
							}).text(function(d){
								var percentage = Math.round(d.pct*100);
								if (percentage > 2) {
									return percentage + "%";
								} else {
									return '';
								}
							});

						valueLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

						valueLabels.exit().remove();


						// var sliceLabel = label_group.selectAll("text.slice").data(filteredPieData);
						// sliceLabel.enter().append("svg:text")
						// 	.attr("class", "slice")
						// 	.attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
						// 	.attr("text-anchor", "middle")
						// 	.text(function(d, i) {
						// 		console.log(d.value);
						// 		if (res.data_type == "currency") {
						// 			if (d.value >= 100) {
						// 				return $filter('currency')(d.value, '$', 0);
						// 			}
						// 			return '';
						// 		} else if (res.data_type == "number") {
						// 			return $filter('number')(d.value, 0);
						// 		}
								
						// 	});

						// sliceLabel.exit().remove();


						//DRAW LABELS WITH ENTITY NAMES
						nameLabels = label_group.selectAll("text.units").data(filteredPieData)
							.attr("dy", function(d){
								if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
									return 17;
								} else {
									return 5;
								}
							})
							.attr("text-anchor", function(d){
								if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
									return "beginning";
								} else {
									return "end";
								}
							}).text(function(d){
								var percentage = Math.round(d.pct*100);
								if (percentage > 2) {
									return d.name;
								} else {
									return '';
								}
							});

						nameLabels.enter().append("svg:text")
							.attr("class", "units")
							.attr("transform", function(d) {
								return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (r+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (r+textOffset) + ")";
							})
							.attr("dy", function(d){
								if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
									return 17;
								} else {
									return 5;
								}
							})
							.attr("text-anchor", function(d){
								if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
									return "beginning";
								} else {
									return "end";
								}
							}).text(function(d){
								var percentage = Math.round(d.pct*100);
								if (percentage > 2) {
									return d.name;
								} else {
									return '';
								}
							});

						nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

						nameLabels.exit().remove();
						
					};

					if (attrs.graphData) {
						ctrl.update(JSON.parse(attrs.graphData));
					}

					///////////////////////////////////////////////////////////
					// FUNCTIONS //////////////////////////////////////////////
					///////////////////////////////////////////////////////////

					// Interpolate the arcs in data space.
					function pieTween(d, i) {
						var s0;
						var e0;
						if(oldPieData[i]){
							s0 = oldPieData[i].startAngle;
							e0 = oldPieData[i].endAngle;
						} else if (!(oldPieData[i]) && oldPieData[i-1]) {
							s0 = oldPieData[i-1].endAngle;
							e0 = oldPieData[i-1].endAngle;
						} else if(!(oldPieData[i-1]) && oldPieData.length > 0){
							s0 = oldPieData[oldPieData.length-1].endAngle;
							e0 = oldPieData[oldPieData.length-1].endAngle;
						} else {
							s0 = 0;
							e0 = 0;
						}
						i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
						return function(t) {
							var b = i(t);
							return arc(b);
						};
					}

					function removePieTween(d, i) {
						s0 = 2 * Math.PI;
						e0 = 2 * Math.PI;
						i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
						return function(t) {
							var b = i(t);
							return arc(b);
						};
					}

					function textTween(d, i) {
						var a;
						if(oldPieData[i]){
							a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
						} else if (!(oldPieData[i]) && oldPieData[i-1]) {
							a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
						} else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
							a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
						} else {
							a = 0;
						}
						var b = (d.startAngle + d.endAngle - Math.PI)/2;

						var fn = d3.interpolateNumber(a, b);
						return function(t) {
							var val = fn(t);
							return "translate(" + Math.cos(val) * (r+textOffset) + "," + Math.sin(val) * (r+textOffset) + ")";
						};
					}

				//});
			}
		};
	}])

	.directive('graphBar', ['$parse', '$window', '$http', 'ReportingService', function($parse, $window, $http, ReportingService){
		return {
			restrict:'EA',
			template: "<div></div>",
			scope: {
				control: '='
			},
			link: function(scope, elem, attrs) {
				
				var	container = elem.find('div'),
					outerWidth = container.width(),
					outerHeight = container.width() * 0.45,
					margin = {top: 20, right: 30, bottom: 45, left: 80},
					width = container.width() - margin.left - margin.right,
					height = (container.width() * 0.45) - margin.top - margin.bottom,
					d3 = $window.d3;
					
				var parseDate = d3.time.format("%Y-%m-%d").parse;

				// Width of bars, without padding. 
				var barRawWidth = width / 12,
					barPadding = 10,
					xStart = barPadding + (barRawWidth/2),
					barWidth = barRawWidth - (barPadding*2);

				var x = d3.time.scale().range([xStart, width-xStart]);

				var y = d3.scale.linear()
					.range([height, 0]);
				
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(d3.time.month, 1)
					.tickFormat(d3.time.format('%b'));

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

					
				var chart = d3.select(container[0]).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// x-axis
				chart
					.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")") 
					.call(xAxis);

				
				var ctrl = this;
				if (scope.control) {
					ctrl = scope.control;
				}
				ctrl.update = function(data) {
					// console.log(ReportingService.getDates().start);
					// var start_month = moment( ReportingService.getDates().start ).month();
					// ReportingService start is not used within history, it is hard coded to one year back.

					var test_months = {};
					
					data.forEach(function(d) {
						test_months[ moment(d.date, "YYYY-MM-DD").month() ] = test_months[ moment(d.date, "YYYY-MM-DD").month() ] === undefined ?  d.count : test_months[ moment(d.date, "YYYY-MM-DD").month() ] + d.count;
					});

					var build_months = [],
						month_year_ago = moment().utc().subtract(11, 'month').month(),
						year_ago = moment().utc().subtract(1, 'year').year();
					for(var i = 0; i < 12; i++) {
						var t = 0;
						
						if (_.contains(_.keys(test_months), month_year_ago + ""))  {
							t = test_months[ month_year_ago + "" ];
						}
						build_months.push({
							date: parseDate( moment( year_ago + "-" + (month_year_ago + 1) + "-01", "YYYY-MM-DD" ).utc().format('YYYY-MM-DD') ),
							count: t
						});
						
						month_year_ago++;
						if (month_year_ago == 12) {
							month_year_ago = 0;
							year_ago++;
						}
					}

					data = build_months;
					

					x.domain(d3.extent(data, function(d) { return d.date; }));
					y.domain([0, d3.max(data, function(d) { return d.count; })]);

					// y-axis
					chart.select(".y.axis").remove();
					chart.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("Total Monthly Chargebacks ($)");

					var bar = chart.selectAll(".bar")
						.data(data, function(d) { return d.date; });

					// new data:
					bar.enter().append("rect")
						.attr("class", "bar")
						.attr("x", function(d) { return x(d.date) - (barWidth/2); })
						.attr("y", function(d) { return y(d.count); })
						.attr("width", barWidth)
						.attr("height", function(d) { return height - y(d.count); })
						.on("mouseover", function() { tooltip1.style("display", null); })
						.on("mouseout", function() { tooltip1.style("display", "none"); })
						.on("mousemove", function(d) {
						var xPosition = d3.mouse(this)[0] - 15;
						var yPosition = d3.mouse(this)[1] - 25;
						tooltip1.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
						tooltip1.select("text").text( d.count ); });

					bar
						.transition()
						.duration(750)
						.attr("y", function(d) { return y(d.count); })
						.attr("height", function(d) { return height - y(d.count); });

					// removed data:
					bar.exit().transition().remove();
					
					
					// updated data:
					bar
						.transition()
						.duration(750)
						.attr("y", function(d) { return y(d.count); })
						.attr("height", function(d) { return height - y(d.count); });


					chart.select(".x.axis").remove();
					chart.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					chart.select(".y.axis").remove();
					chart.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end");
					
					chart.append("text")
			            .attr("text-anchor", "middle")  
			            .attr("transform", "rotate(-90)")
        				.attr("y", 0 - margin.left)
        				.attr("x", 0 - (height / 2))
        				.attr("dy", "2em")
        				.attr("font-size", "14px")
			            .attr("fill", "white")
			            .text("Number");

			        chart.append("text")
			            .attr("text-anchor", "middle") 
			            .attr("fill", "white") 
			            .attr("font-size", "14px")
			            .attr("transform", "translate("+ (width/2) +","+(height + margin.bottom)+")")  
			            .text("Months");

					//tool tip
			        var tooltip1 = chart.append("g")
			          .attr("class", "tooltip1")
			          .style("display", "none");

			        tooltip1.append("rect")
                        .attr("width", 30)
                        .attr("height", 20)
                        .attr("fill", "#2E2E2E")
                        .style("opacity", 0.7);  
			        
			        tooltip1.append("text")
			          .attr("x", 15)
			          .attr("dy", "1.2em")
			          .style("text-anchor", "middle")
			          .attr("font-size", "12px")
			          .attr("fill", "white")
			          .attr("font-weight", "bold");
				
				};

				if (attrs.graphData) {
					ctrl.update(JSON.parse(attrs.graphData));
				}
				
			}
		};
	}])
.directive('reasonBar', ['$parse', '$window', '$http', 'ReportingService', 'ReasonCodeList', function($parse, $window, $http, ReportingService, ReasonCodeList){
		return {
			restrict:'EA',
			template: "<div></div>",
			scope: {
				control: '='
			},
			link: function(scope, elem, attrs) {
				
				var	container = elem.find('div'),
					outerWidth = container.width(),
					outerHeight = container.width() * 0.45,
					margin = {top: 20, right: 40, bottom: 50, left: 90},
					width = container.width() - margin.left - margin.right,
					height = (container.width() * 0.45) - margin.top - margin.bottom,
					d3 = $window.d3;

				var barOuterPad = 0.2,
					barPad = 0.2;	
	
				var x = d3.scale.ordinal().rangeRoundBands([5, width], barPad, barOuterPad);

				var y = d3.scale.linear()
					.range([height, 0]);
				
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

					
				var chart = d3.select(container[0]).append("svg")
					.attr("width", outerWidth)
					.attr("height", outerHeight)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// x-axis
				chart
					.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")") 
					.call(xAxis)
				.selectAll("text")
				    .style("text-anchor", "end")
				    .attr("dx", "-.8em")
				    .attr("dy", "-.55em")
				    .attr("transform", "rotate(-45)" );
   				

				var ctrl = this;
				if (scope.control) {
					ctrl = scope.control;
				}

				ctrl.update = function(data) {
					var filter = data.data_type;
					data = data.data;

					// if data_type is currency, sum will take the place of count on y axix.
					data.forEach(function (d){
						if (filter == "Currency") {
							var sum = d.sum;
							d.count = sum;
						}
					});

					x.domain(data.map(function(d) { return d.name; }));
					y.domain([0, d3.max(data, function(d) { return d.count; })]);

					// y-axis
					chart.select(".y.axis").remove();
					chart.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end");

					var reasonbar = chart.selectAll(".reasonbar")
						.data(data, function(d) { return d.name; });

					// new data:
					reasonbar.enter().append("rect")
						.attr("class", "reasonbar")
						.attr("fill", "#FDE3A7")
						.attr("x", function(d) { return x(d.name); })
						.attr('width', x.rangeBand())
						.attr("y", function(d) { return y(d.count); })
						.attr("height", function(d) { return height - y(d.count); });
					
					reasonbar
						.transition()
						.duration(750)
						.attr("x", function(d) { return x(d.name); })
						.attr("y", function(d) { return y(d.count); })
						.attr("width", x.rangeBand())
						.attr("height", function(d) { return height - y(d.count); });

					// removed data:
					reasonbar.exit().transition().remove();
					
					// updated data:
					reasonbar
						.transition()
						.duration(750)
						.attr("x", function(d) { return x(d.name); })
						.attr("y", function(d) { return y(d.count); })
						.attr("width", x.rangeBand())
						.attr("height", function(d) { return height - y(d.count); });

					chart.select(".x.axis").remove();
					chart.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis)
					.selectAll("text")
					    .style("text-anchor", "end")
					    .attr("dx", "-.8em")
					    .attr("dy", "-.55em")
					    .attr("transform", "rotate(-45)" );	

					chart.select(".y.axis").remove();
					
					chart.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end");		
				
					chart.append("text")
			            .attr("text-anchor", "middle")  
			            .attr("transform", "rotate(-90)")
        				.attr("y", 0 - margin.left)
        				.attr("x", 0 - (height / 2))
        				.attr("dy", "2em")
        				.attr("font-size", "14px")
			            .attr("fill", "white")
			            .text(function() { return filter; });    

			        chart.append("text")
			            .attr("text-anchor", "middle") 
			            .attr("fill", "white") 
			            .attr("font-size", "14px")
			            .attr("transform", "translate("+ (width/2) +","+(height + margin.bottom)+")")  
			            .text("Reason Codes");	

				};

				if (attrs.graphData) {
					ctrl.update(JSON.parse(attrs.graphData));
				}
				
			}
		};
	}]);

})();
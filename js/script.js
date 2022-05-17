//create a namespace for canvas
var cv = {
  'width': 930,
  'height':780,
	'top': 50,
	'right': 10,
	'bottom': 10,
	'left': 10,
  'fieldLineWidth': 2
};

//create scale for soccer field
var xScaleField = d3.scaleLinear()
  .domain([0, cv.width + cv.left + cv.right])
  .range([0, cv.width + cv.left + cv.right]);

var yScaleField = d3.scaleLinear()
  .domain([0, cv.height + cv.top + cv.bottom])
  .range([cv.height + cv.top + cv.bottom, 0]);

//create scales for shot X/Y
var xScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([0, cv.width]);

var yScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([cv.height, 0]);

//create a svg as main cavnas
var svg = d3.select('#canvas').append('svg')
  .attr('width', cv.width + cv.left + cv.right)
  .attr('height', cv.height + cv.top + cv.bottom);

//draw the soccer field in svg
//draw field background
svg.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', cv.width + cv.top + cv.right)
  .attr('height', cv.height + cv.top + cv.bottom)
  .attr('fill', '#222222')
  .attr('fill-opacity', 0.9);

var field = svg.append('g')
  .attr('class', 'field-lines')
  .attr('transform', 'translate(' + cv.left + ' ' + cv.top + ')' );

//draw side lines
field.append('line')
  .attr('x1', 0)
  .attr('x2', 0)
  .attr('y1', 0)
  .attr('y2', cv.height)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', cv.width)
  .attr('x2', cv.width)
  .attr('y1', 0)
  .attr('y2', cv.height)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

//draw end lines
field.append('line')
  .attr('x1', 0)
  .attr('x2', cv.width)
  .attr('y1', 0)
  .attr('y2', 0)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', 0)
  .attr('x2', cv.width)
  .attr('y1', cv.height)
  .attr('y2', cv.height)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

//draw midfield circle
// field.append('line')

//draw penalty area
field.append('line')
  .attr('x1', 245)
  .attr('x2', 245)
  .attr('y1', 0)
  .attr('y2', 180)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', 685)
  .attr('x2', 685)
  .attr('y1', 0)
  .attr('y2', 180)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', 245)
  .attr('x2', 685)
  .attr('y1', 180)
  .attr('y2', 180)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

//draw goal box
field.append('line')
  .attr('x1', 365)
  .attr('x2', 365)
  .attr('y1', 0)
  .attr('y2', 60)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', 565)
  .attr('x2', 565)
  .attr('y1', 0)
  .attr('y2', 60)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

field.append('line')
  .attr('x1', 365)
  .attr('x2', 565)
  .attr('y1', 60)
  .attr('y2', 60)
  .attr('stroke-width', cv.fieldLineWidth)
  .attr('stroke', '#ffffff');

//read in the data from csv
d3.csv('data/data.csv').then(
  function(data) {
    // console.log(data);
    //filter goals
    var goals = data.filter(isAGoal);
    console.log(goals);

    //plot all goals
    svg.append('g')
      .attr('class', 'goals')
      .selectAll('.goal')
      .data(goals)
      .enter().append('circle')
      .attr('class', 'goal')
      .attr('data-id', d => d.id)
      .attr('data-minute', d => d.minute)
      .attr('data-result', d => d.result)
      .attr('data-X', d => d.X)
      .attr('data-Y', d => d.Y)
      .attr('data-a_goals', d => d.a_goals)
      .attr('data-a_team', d => d.a_team)
      .attr('data-date', d => d.date)
      .attr('data-h_a', d => d.h_a)
      .attr('data-h_goals', d => d.h_goals)
      .attr('data-h_team', d => d.h_team)
      .attr('data-lastAction', d => d.lastAction)
      .attr('data-match_id', d => d.match_id)
      .attr('data-player', d => d.player)
      .attr('data-player_assisted', d => d.player_assisted)
      .attr('data-player_id', d => d.player_id)
      .attr('data-season', d => d.season)
      .attr('data-shotType', d => d.shotType)
      .attr('data-situation', d => d.situation)
      .attr('data-xG', d => d.xG)
      .attr('r', 3)
      .attr('cx', d => xScaleUnderstat(d.X))
      .attr('cy', d => yScaleUnderstat(d.Y))
      .attr('fill-opacity', 0)
      .attr('stroke', '#FFFF00')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 1);

    //draw anchor dots ##remove later
    field.append('circle')
      .attr('r', 5)
      .attr('cx', xScaleUnderstat(0))
      .attr('cy', yScaleUnderstat(0))
      .attr('fill', 'red')
      .attr('stroke', '#FFFF00')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 1);

    field.append('circle')
      .attr('r', 5)
      .attr('cx', xScaleUnderstat(1))
      .attr('cy', yScaleUnderstat(0))
      .attr('fill', 'red')
      .attr('stroke', '#FFFF00')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 1);

    field.append('circle')
      .attr('r', 5)
      .attr('cx', xScaleUnderstat(0))
      .attr('cy', yScaleUnderstat(1))
      .attr('fill', 'red')
      .attr('stroke', '#FFFF00')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 1);

    field.append('circle')
      .attr('r', 5)
      .attr('cx', xScaleUnderstat(1))
      .attr('cy', yScaleUnderstat(1))
      .attr('fill', 'red')
      .attr('stroke', '#FFFF00')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 1);


    //add mouseover
    d3.selectAll('.goal').on('mouseover', function(d){
      var thisGoal = d3.select(this);
      console.log(thisGoal.attr('data-player') + ' ' + thisGoal.attr('data-h_team') + ' vs ' + thisGoal.attr('data-a_team'));
    });

  }
);

function isAGoal(obj) {
  return obj.result == 'Goal';
  // return obj.result == 'Goal' || obj.result == 'OwnGoal'
};


//add player profiles

//add filters




//to-do list
//- plot field (30mins)
//- rotate understat coordinate system
//- add meta info
//- add player profiles
//- animation of goals
//- add filters
//- plot hexagon heatmap
//- add youtube links
//- xG map?

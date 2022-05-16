//create a namespace for canvas
var cv = {
  'width': 400,
  'height': 600,
	'top': 10,
	'right': 10,
	'bottom': 10,
	'left': 10
};

//create scales for shot X/Y
var xScalePitch = d3.scaleLinear()
  .domain([0, 1])
  .range([0, 400]);

var yScalePitch = d3.scaleLinear()
  .domain([0, 1])
  .range([0, 600]);

//read in the data from csv
d3.csv('data/data.csv').then(
  function(data) {
    // console.log(data);
    //filter goals
    var goals = data.filter(isAGoal);
    console.log(goals);

    //create a svg as main cavnas
    var svg = d3.select('#canvas').append('svg')
    .attr('width', cv.width + cv.top + cv.right)
    .attr('height', cv.height + cv.top + cv.bottom);
    // .append('g')
    // .attr('transform', 'translate(' + (cv.left + cv.width) / 2 + ',' + (cv.top + cv.height/2) + ')');

    //add pitch background
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', cv.width + cv.top + cv.right)
      .attr('height', cv.height + cv.top + cv.bottom)
      .attr('fill', 'green')
      .attr('fill-opacity', 0.2);

    //plot all goals
    svg.selectAll('.goal')
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
      .attr('cx', d => xScalePitch(d.X))
      .attr('cy', d => xScalePitch(d.Y))
      .attr('fill-opacity', 0)
      .attr('stroke', '#0063C3')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.8);

  }
);

function isAGoal(obj) {
  return obj.result == 'Goal';
  // return obj.result == 'Goal' || obj.result == 'OwnGoal'
};


//add field with lines

//add player profiles

//add filters

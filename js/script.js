//create a namespace for canvas
var cv = {
  'width': 780,
  'height':780,
	'top': 10,
	'right': 10,
	'bottom': 10,
	'left': 10
};

//create scales for shot X/Y
var xScalePitch = d3.scaleLinear()
  .domain([0, 1])
  .range([0, cv.width + cv.left + cv.right]);

var yScalePitch = d3.scaleLinear()
  .domain([0, 1])
  .range([cv.height + cv.top + cv.bottom, 0]);

//create a svg as main cavnas
var svg = d3.select('#canvas').append('svg')
  .attr('width', cv.width + cv.top + cv.right)
  .attr('height', cv.height + cv.top + cv.bottom);

//draw the soccer pitch in svg


//read in the data from csv
d3.csv('data/data.csv').then(
  function(data) {
    // console.log(data);
    //filter goals
    var goals = data.filter(isAGoal);
    console.log(goals);

    //add pitch background
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', cv.width + cv.top + cv.right)
      .attr('height', cv.height + cv.top + cv.bottom)
      .attr('fill', '#222222')
      .attr('fill-opacity', 0.9);

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
      .attr('cy', d => yScalePitch(d.Y))
      .attr('fill-opacity', 0)
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


//add field with lines

//add player profiles

//add filters

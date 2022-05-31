//create a namespace for shotMap
var sm = {
  'width': 930,
  'height': 780,
	'top': 50,
	'right': 10,
	'bottom': 10,
	'left': 10,
  'fieldLineWidth': 2
};

//create a namespace for xG slope
var xs = {
  'width': 930,
  'height': 780,
  'top': 10,
  'right': 50,
  'bottom': 10,
  'left': 50,
}

//create player selector badges
d3.select('#player_selector')
  .selectAll('span')
  .data(milan_players)
  .enter()
  .append('span')
  .attr('class', 'badge badge-dark')
  .text(d => d.jersey_number + '-' + d.last_name);

// <span class="badge badge-primary">Primary</span>


//create a svg for shot map
var shotMap = d3.select('#shot_map').append('svg')
  .attr('width', sm.width + sm.left + sm.right)
  .attr('height', sm.height + sm.top + sm.bottom);

//create a svg for xG slope
// var xG_slope = d3.select('#xG_slope').append('svg')
// .attr('width', xs.width + xs.left + xs.right)
// .attr('height', xs.height + xs.top + xs.bottom);

//read in the data from csv
d3.csv('data/data.csv').then(
  function(data) {
    //get data for xG slope
    var xGSlopeData = data.filter(isAMilanShot);
    // console.log(xGSlopeData);

    //draw shot map
    drawShotmap(data);
  }
);

function isAMilanShot(obj) {
  return milan_players.map(function(d) {
    return d.understat_id;
  }).includes(obj.player_id) && obj.result !== 'OwnGoal';
};

function drawShotmap(data) {
  //create scales for shot X/Y
  sm.xScaleUnderstat = d3.scaleLinear()
    .domain([0, 1])
    .range([sm.height, 0]);

  sm.yScaleUnderstat = d3.scaleLinear()
    .domain([0, 1])
    .range([sm.width, 0]);

  //draw field background
  shotMap.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', sm.width + sm.top + sm.right)
    .attr('height', sm.height + sm.top + sm.bottom)
    .attr('fill', '#222222')
    .attr('fill-opacity', 0.9);

  //draw soccer field
  drawFieldLines();

  //filter goals
  // var selectedPlayerId = '7193'// Leao
  var selectedPlayerId = '502' //
  var selectedShots = data.filter(function(obj) {
    // return true;
    // return obj.player_id == selectedPlayerId || obj.player_id == '11111';
    // return obj.player_id == '11111';
    // return obj.player_id == selectedPlayerId;
    return milan_players.map(function(d) {
      return d.understat_id;
    }).includes(obj.player_id);
  });

  //convert understat data to list of coord of shoots. This will be fed to hexbin
  var selectedShotsCoord = Object.keys(selectedShots)
    .map((key) => [
      sm.yScaleUnderstat(parseFloat(selectedShots[key].Y)),
      sm.xScaleUnderstat(parseFloat(selectedShots[key].X))
      ]
    );

  //define color scale
  var color = d3.scaleSequential(d3.interpolateLab('white', 'steelblue'))
      .domain([0, 4]);

  //define hexbin function
  var hexbin = d3.hexbin()
      .radius(15)
      .extent([[0, 0], [sm.width, sm.height]]);

  //draw hexbins
  shotMap.append('g')
      .attr('class', 'hexbin')
      .attr('transform', 'translate(' + sm.left + ', ' + sm.top + ')')
      .selectAll('path')
      .data(hexbin(selectedShotsCoord))
      .enter().append('path')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .attr('d', hexbin.hexagon())
      .attr('fill', function(d) {
        return color(d.length);
      });

  //plot all goals
  shotMap.append('g')
    .attr('class', 'goals')
    .attr('transform', 'translate(' + sm.left + ' ' + sm.top + ')')
    .selectAll('.goal')
    .data(selectedShots)
    .enter().append('circle')
    .attr('class', 'goal')
    .attr('data-id', d => d.id)
    .attr('data-minute', d => d.minute)
    .attr('data-result', d => d.result)
    .attr('data-X', d => d.X)
    .attr('data-X-scaled', d => sm.xScaleUnderstat(d.X))//##
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
    .attr('cy', d => sm.xScaleUnderstat(parseFloat(d.X)))
    .attr('cx', d => sm.yScaleUnderstat(parseFloat(d.Y)))
    .attr('fill-opacity', 0)
    .attr('stroke', 'yellow')
    .attr('stroke-width', 1.2)
    .attr('stroke-opacity', 1);

  //add mouseover
  d3.selectAll('.goal').on('mouseover', function(d){
    var thisGoal = d3.select(this);
    console.log(thisGoal.attr('data-player') + ' ' + thisGoal.attr('data-h_team') + ' vs ' + thisGoal.attr('data-a_team'));
    console.log(thisGoal.attr('data-X') + ', ' + thisGoal.attr('data-Y'));
    console.log(sm.yScaleUnderstat(thisGoal.attr('data-X')) + ', ' + sm.xScaleUnderstat(thisGoal.attr('data-Y')));
  });
}

function drawFieldLines() {
  var field = shotMap.append('g')
    .attr('class', 'field-lines')
    .attr('transform', 'translate(' + sm.left + ' ' + sm.top + ')' );

  //draw side lines
  field.append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', sm.height)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', sm.width)
    .attr('x2', sm.width)
    .attr('y1', 0)
    .attr('y2', sm.height)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  //draw end lines
  field.append('line')
    .attr('x1', 0)
    .attr('x2', sm.width)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', 0)
    .attr('x2', sm.width)
    .attr('y1', sm.height)
    .attr('y2', sm.height)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  //draw midfield circle
  // field.append('line')

  //draw penalty area
  field.append('line')
    .attr('x1', 245)
    .attr('x2', 245)
    .attr('y1', 0)
    .attr('y2', 180)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', 685)
    .attr('x2', 685)
    .attr('y1', 0)
    .attr('y2', 180)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', 245)
    .attr('x2', 685)
    .attr('y1', 180)
    .attr('y2', 180)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  //draw goal box
  field.append('line')
    .attr('x1', 365)
    .attr('x2', 365)
    .attr('y1', 0)
    .attr('y2', 60)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', 565)
    .attr('x2', 565)
    .attr('y1', 0)
    .attr('y2', 60)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');

  field.append('line')
    .attr('x1', 365)
    .attr('x2', 565)
    .attr('y1', 60)
    .attr('y2', 60)
    .attr('stroke-width', sm.fieldLineWidth)
    .attr('stroke', '#ffffff');
};

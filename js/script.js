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

var xs = {
  'width': 930,
  'height': 780,
  'top': 10,
  'right': 50,
  'bottom': 10,
  'left': 50,
}

var milan_players = [
  '7193',
  '502',
  '1741',
  '8838',
  '2547',
  '7958',
  '8297',
  '1574',
  '1489',
  '1852',
  '6421',
  '1254',
  '6981',
  '1119',
  '1311',
  '703',
  '1471',
  '4699',
  '3429',
  '8163',
  '2303',
  '4920',
  '8313',
  '1547',
  '5803',
  '9440',
  '3737',
  '1416'
];

//create scales for shot X/Y
sm.xScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([sm.height, 0]);

sm.yScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([sm.width, 0]);

//create a svg for shot map
var shotMap = d3.select('#shot_map').append('svg')
  .attr('width', sm.width + sm.left + sm.right)
  .attr('height', sm.height + sm.top + sm.bottom + 300);//##

//create a svg for xG slope
// var xG_slope = d3.select('#xG_slope').append('svg')
// .attr('width', xs.width + xs.left + xs.right)
// .attr('height', xs.height + xs.top + xs.bottom);

//draw the soccer field in svg
//draw field background
shotMap.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', sm.width + sm.top + sm.right)
  .attr('height', sm.height + sm.top + sm.bottom + 1000)
  .attr('fill', '#222222')
  .attr('fill-opacity', 0.9);

drawFieldLines();

//read in the data from csv
d3.csv('data/data-test.csv').then(
  function(data) {
    //get data for xG slope
    var xGSlopeData = data.filter(isAMilanShot);

    console.log(xGSlopeData);


    drawShotmap(data);
  }
);

function isAGoal(obj) {
  return obj.result == 'Goal';
  // return obj.result == 'Goal' || obj.result == 'OwnGoal'
};

function isAMilanGoal(obj) {
  return obj.result == 'Goal' && milan_players.includes(obj.player_id);
  // return obj.result == 'Goal' || obj.result == 'OwnGoal'
};

function isAMilanShot(obj) {
  return milan_players.includes(obj.player_id);
};

function drawShotmap(data) {

  //filter goals
  // var selectedShots = data.filter(isAMilanGoal);
  // var selectedShots = data;
  var selectedPlayerId = '7193'
  var selectedShots = data.filter(function(obj) {
    return obj.player_id == selectedPlayerId || obj.player_id == '11111';
  });

  var selectedShotsCoord = Object.keys(selectedShots).map((key) => [sm.xScaleUnderstat(parseFloat(selectedShots[key].Y)), sm.yScaleUnderstat(parseFloat(selectedShots[key].X))]);
  console.log(selectedShotsCoord);

  var color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
      .domain([0, 3]);

  var hexbin = d3.hexbin()
  // .size([1000, 30])
      .radius(30)
      // .extent([[0, 0], [sm.width, sm.height]]);
      .size([sm.width, sm.height]);
      // .extent([[sm.left, sm.top], [(sm.height + sm.top), (sm.width + sm.left)]]);
      // .extent([[10, 50], [50, 60]]);
      // .extent([[sm.top, sm.left], [sm.height + sm.top, sm.width + sm.left]]);

  shotMap.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr('transform', 'translate(' + sm.left + ', ' + sm.top + ')')
      .attr("width", sm.width)
      .attr("height", sm.height);

  shotMap.append("g")
      .attr("class", "hexagon")
      .attr('transform', 'translate(' + sm.left + ', ' + sm.top + ')')
      // .attr("clip-path", "url(#clip)")
      .selectAll("path")
      .data(hexbin(selectedShotsCoord))
      .enter().append("path")
      // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      // .attr("d", hexbin.hexagon())
      .attr("d", d => `M${d.x},${d.y}${hexbin.hexagon()}`)
      .attr("fill", function(d) {
        return color(d.length);
      });

        console.log(hexbin.extent());


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
    // .attr('stroke', '#FFFF00')
    .attr('stroke', function(d){
      if(d.X == '0' && d.Y == '0') {
        return 'white';
      } else if (d.X == '1' && d.Y == '0') {
        return 'green';
      } else if (d.X == '0' && d.Y == '1') {
        return 'yellow';
      } else if (d.X == '1' && d.Y == '1') {
        return 'red';
      } else {
        return 'yellow';
      }
    })
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

//add player profiles

//add filters


//to-do list
//- plot field (DONE)
//- rotate understat coordinate system (DONE)
//- add meta info (DONE)
//- add player profiles
//- animation of goals
//- add filters
//- plot hexagon heatmap
//- add youtube links
//- xG map?

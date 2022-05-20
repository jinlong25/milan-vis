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
var xScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([cv.height, 0]);

var yScaleUnderstat = d3.scaleLinear()
  .domain([0, 1])
  .range([cv.width, 0]);

//create a svg as main cavnas
var svg = d3.select('#canvas').append('svg')
  .attr('width', cv.width + cv.left + cv.right)
  .attr('height', cv.height + cv.top + cv.bottom + 1000);

//draw the soccer field in svg
//draw field background
svg.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', cv.width + cv.top + cv.right)
  .attr('height', cv.height + cv.top + cv.bottom + 1000)
  .attr('fill', '#222222')
  .attr('fill-opacity', 0.9);

drawFieldLines();

//read in the data from csv
d3.csv('data/data.csv').then(
  function(data) {

    //filter goals
    // var selectedShots = data.filter(isAMilanGoal);
    // var selectedShots = data;
    var selectedPlayerId = '7193'
    var selectedShots = data.filter(function(obj) {
      return obj.player_id == selectedPlayerId || obj.player_id == '11111';
    });

    var selectedShotsCoord = Object.keys(selectedShots).map((key) => [xScaleUnderstat(parseFloat(selectedShots[key].Y)), yScaleUnderstat(parseFloat(selectedShots[key].X))]);
    console.log(selectedShotsCoord);

    var color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
        .domain([0, 3]);

    var hexbin = d3.hexbin()
    // .size([1000, 30])
        .radius(30)
        .extent([[0, 0], [cv.width, cv.height]]);
        // .extent([[cv.left, cv.top], [(cv.height + cv.top), (cv.width + cv.left)]]);
        // .extent([[10, 50], [50, 60]]);
        // .extent([[cv.top, cv.left], [cv.height + cv.top, cv.width + cv.left]]);

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr('transform', 'translate(' + cv.left + ', ' + cv.top + ')')
        .attr("width", cv.width)
        .attr("height", cv.height);

    svg.append("g")
        .attr("class", "hexagon")
        .attr('transform', 'translate(' + cv.left + ', ' + cv.top + ')')
        // .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(selectedShotsCoord))
        .enter().append("path")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("d", hexbin.hexagon())
        .attr("fill", function(d) {
          return color(d.length);
        });

          console.log(hexbin.extent());


    //plot all goals
    svg.append('g')
      .attr('class', 'goals')
      .attr('transform', 'translate(' + cv.left + ' ' + cv.top + ')')
      .selectAll('.goal')
      .data(selectedShots)
      .enter().append('circle')
      .attr('class', 'goal')
      .attr('data-id', d => d.id)
      .attr('data-minute', d => d.minute)
      .attr('data-result', d => d.result)
      .attr('data-X', d => d.X)
      .attr('data-X-scaled', d => xScaleUnderstat(d.X))//##
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
      .attr('cy', d => xScaleUnderstat(parseFloat(d.X)))
      .attr('cx', d => yScaleUnderstat(parseFloat(d.Y)))
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
      console.log(yScaleUnderstat(thisGoal.attr('data-X')) + ', ' + xScaleUnderstat(thisGoal.attr('data-Y')));
    });

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

function drawFieldLines() {
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

import React, { Component } from 'react';
import { GradientDarkgreenGreen } from '@vx/gradient';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Group } from '@vx/group';
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { Bar } from '@vx/shape';
import {connect} from "react-redux";

class Chart extends Component {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
    
    this.setSize();
  }

  setSize = (event) => {
    const { width, height } = this.chart.getBoundingClientRect();

    this.setState((prevState) => {
      return {
        width,
        height
      };
    });
  };

  setRef = (node) => {
    this.chart = node;
  };

  setData = (trees) => {
    let heights = ["0m - 10m", "10m - 20m", "20m - 30m", "30m - 40m","40m - 50m" ,"50m - 60m", "60m - 70m"];
    let data = heights.map(h => {
      return {height: h, amount: 0}
    });
    trees.forEach(tree => {
      let h = tree.height;
      switch (true) {
          case (0 <= h && h < 10):
              data[0].amount++;
              break;
          case (10 <= h && h < 20):
              data[1].amount++;
              break;
          case (20 <= h && h < 30):
              data[2].amount++;
              break;
          case (30 <= h && h < 40):
              data[3].amount++;
              break;
          case (40 <= h && h < 50):
              data[4].amount++;
              break;
          case (50 <= h && h < 60):
              data[5].amount++;
              break;
          case (60 <= h && h <= 70):
              data[6].amount++;
              break;
          default:
      }
    });
    return data;
  };

  render() {
    const { width, height } = this.state;
    const data = this.setData(this.props.siteTrees);

      const x = d => d.height;
      const y = d => d.amount;
      const maxAmount = Math.max(...data.map(y));

      const margin = { top: 30, bottom: 30, left: 40, right: 10 };
      const xMax = width - margin.left - margin.right;
      const yMax = height - margin.top - margin.bottom;

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, maxAmount]
    });
      const xScale = scaleBand({
          range: [0, xMax],
          domain: data.map(x),
          padding: 0.3
      });
    
    /* This is a hack to first set the size based on percentage
       then query for the size so the chart can be scaled to the window size.
       The second render is caused by componentDidMount(). */
    if(width < 100 || height < 100) {
      return <svg ref={ this.setRef } width={'100%'} height={'100%'}></svg>
    }

    return (
      <svg ref={ this.setRef } width={'100%'} height={'100%'}>
        <GradientDarkgreenGreen id="gradient" />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#gradient)`}
        />
          <AxisLeft
              scale={yScale}
              top={margin.top}
              left={margin.left}
              numTicks={maxAmount}
              tickFormat={val => val.toFixed(0)}
              hideAxisLine={true}
              hideTicks={true}
              tickLabelProps={() => ({ dx: '-0.25em', dy: '0.25em', textAnchor: 'end', fontFamily: 'Arial', fontSize: 10, fill: 'white' })}
          />
          <AxisBottom
              scale={xScale}
              top={yMax + margin.top}
              left={margin.left}
              hideAxisLine={true}
              hideTicks={true}
              tickLabelProps={() => ({ dy: '0.25em', textAnchor: 'middle', fontFamily: 'Arial', fontSize: 10, fill: 'white' })}
          />
          <Group top={margin.top} left={margin.left}>
              {data.map(d => {
                  const barHeight = yMax - yScale(y(d));
                  return (
                      <Bar key={x(d)}
                           width={xScale.bandwidth()}
                           height={barHeight}
                           x={xScale(x(d))}
                           y={yMax - barHeight}
                           fill="rgba(23, 233, 217, .5)"
                      />
                  );
              })}
          </Group>
      </svg>
    );
  }
}

function mapStateToProps(state) {
    return {
        siteTrees: state.trees.siteTrees
    };
}

export default connect(mapStateToProps)(Chart);

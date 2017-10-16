class Table extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    let rows = [];
    let columns = [];
    const cells = this.props.cellData
    
    
    for(let c=0;c<cells.length;c++){
        if(cells[c] === 1){
          rows.push(<td id={c} onClick={this.props.changeSquare} className="alive"></td>);
        }
        else{
          rows.push(<td id={c} onClick={this.props.changeSquare} className="dead"></td>);
        }  
          if(rows.length === 50){
            columns.push(<tr>{rows}</tr>);
            rows = [];
          }
        
     }
    return (
        <table>
          {columns}
        </table>
    );
  }
}

class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      indices:[],
      intervalId: '',
      generations: 0
    }
    this.newCycle = this.newCycle.bind(this);
    this.census = this.census.bind(this);
    this.updateIndice = this.updateIndice.bind(this);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.clear = this.clear.bind(this);
  }
  
  componentWillMount(){                             
    let initArray = [];
    
    for(let i=1;i<2500 + 1;i++){                     //number is sqrd
      let randInt = Math.random();
      if(randInt >= .5){
        initArray.push(0);
      }
      else{
        initArray.push(1);
      }
    } 
    this.setState({indices:initArray});
  }

  census(array, index){
    let population = []; 
    
    if(index === 0){                   //top left corner
      population.push(array[2499]);
      population.push(array[2450]);
      population.push(array[2451]);
      population.push(array[49]);
      population.push(array[1]);
      population.push(array[99]);
      population.push(array[50]);
      population.push(array[51]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index === 49){                  //top right corner
      population.push(array[2498]);
      population.push(array[2499]);
      population.push(array[2450]);
      population.push(array[48]);
      population.push(array[0]);
      population.push(array[98]);
      population.push(array[99]);
      population.push(array[50]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index === 2450){               //bottom left corner
      population.push(array[2449]);
      population.push(array[2400]);
      population.push(array[2401]);
      population.push(array[2499]);
      population.push(array[2451]);
      population.push(array[49]);
      population.push(array[0]);
      population.push(array[1]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index === 2499){               //bottom right corner
      population.push(array[2449]);
      population.push(array[2400]);
      population.push(array[2401]);
      population.push(array[2499]);
      population.push(array[2451]);
      population.push(array[49]);
      population.push(array[0]);
      population.push(array[1]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index % 50 === 0){            //left vertical column
      population.push(array[index - 1]);
      population.push(array[index - 50]);
      population.push(array[index - 49]);
      population.push(array[index + 49]);
      population.push(array[index + 1]);
      population.push(array[index + 99]);
      population.push(array[index + 50]);
      population.push(array[index + 51]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index % 50 === 49){          //right vertical column
      population.push(array[index - 51]);
      population.push(array[index - 50]);
      population.push(array[index - 99]);
      population.push(array[index - 1]);
      population.push(array[index - 49]);
      population.push(array[index + 49]);
      population.push(array[index + 50]);
      population.push(array[index + 1]);
      return population.reduce((a, b) => a + b, 0);
    } 
    else if(index > 0 && index < 49){          //top horizontal row
      population.push(array[index + 2449]);
      population.push(array[index + 2450]);
      population.push(array[index + 2451]);
      population.push(array[index - 1]);
      population.push(array[index + 1]);
      population.push(array[index + 49]);
      population.push(array[index + 50]);
      population.push(array[index + 52]);
      return population.reduce((a, b) => a + b, 0);
    }
    else if(index > 2450 && index < 2499){          //bottom horizontal row
      population.push(array[index - 51]);
      population.push(array[index - 50]);
      population.push(array[index - 49]);
      population.push(array[index - 1]);
      population.push(array[index + 1]);
      population.push(array[index - 2451]);
      population.push(array[index - 2450]);
      population.push(array[index - 2449]);
      return population.reduce((a, b) => a + b, 0);
    } 
    else{
      population.push(array[index - 51]);
      population.push(array[index - 50]);
      population.push(array[index - 49]);
      population.push(array[index - 1]);
      population.push(array[index + 1]);
      population.push(array[index + 49]);
      population.push(array[index + 50]);
      population.push(array[index + 51]);
      return population.reduce((a, b) => a + b, 0);
    }
  }
  
  newCycle(){
    let newCycleArray = [];
    const compareArray = this.state.indices;
    
    for(let x=0;x<compareArray.length;x++){
      if(compareArray[x] === 1){                    //is alive
        if(this.census(compareArray,x) < 2 || this.census(compareArray,x) > 3){
          newCycleArray.push(0);
        }
        else{
          newCycleArray.push(1);
        }
      }
      else{                                         //is dead
        if(this.census(compareArray,x) === 3){
          newCycleArray.push(1);
        }
        else{
          newCycleArray.push(0);
        }
      }
    }
    if(newCycleArray.reduce((a, b) => a + b, 0 > 0)){
      this.setState({indices: newCycleArray});
      this.setState({generations: this.state.generations + 1});
    }
    else{
      this.clear();
    }
  }
  
  componentDidMount(){
    this.start()
  }
  
  updateIndice(){
    const updateIndiceArray = this.state.indices;
    const cellInfo = window.event;
    const cellObj = cellInfo.target || cellInfo.srcElement;
    
    updateIndiceArray[cellObj.id] = 1;
    this.setState({indices: updateIndiceArray})
  }
  
  start(){
    const intervalId = setInterval(this.newCycle, 200);
    this.setState({intervalId: intervalId});
  }
  
  stop(){
    clearInterval(this.state.intervalId);
  }
  
  clear(){
    this.stop()
    const clearArray = [];
    for(let i=1;i<2500 + 1;i++){                  
      clearArray.push(0);
    }
    this.setState({indices: clearArray});
    this.setState({generations: 0});
  }
  
  render(){
    console.log(this.state.intervalId);
    return (
      <div>
        <h3 className="text-center">GAME OF LIFE</h3>
        <Table cellData={this.state.indices} changeSquare={this.updateIndice} />
        <div className="text-center" id="btndiv">
          <button onClick={this.start} className="btn btn-primary">START</button>
          <button onClick={this.stop} className="btn btn-primary">STOP</button>
          <button onClick={this.clear} className="btn btn-primary">CLEAR</button>
          <p>Generations: {this.state.generations}</p>
        </div>
      </div>  
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('app')
);
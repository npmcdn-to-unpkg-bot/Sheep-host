import React from 'react';
import DataItem from './DataItem';

//this.props.databaseInfo is JSON stringified from earlier call.
const DevDatabase = React.createClass({
	

	render() {
	console.log('PROPS', this.props)
	console.log('dev database component RENDER', this.props.databaseInfo)

	var dataArray = []
	this.props.databaseInfo.forEach(function(item, i) {
		dataArray.push(<DataItem key={i} info={item} />)
		console.log('DATAARRAY', dataArray)
	})
	

		return (
			<div><h3>Your Database </h3>
			<div className="jumbotron">
			<ul className="list-group">
			{dataArray}
			</ul>
			</div>
			</div>
			)
	}


})


module.exports = DevDatabase;



	// shouldComponentUpdate (nextProps, nextState) {
	// 	console.log('next' , nextProps)
	// 	if(nextProps.databaseInfo === "") {
	// 		return false
	// 	}
	// 	return true
	// },
// <li className="list-group-item">{dataItems}</li>}

	// var userDbInfo=this.props.databaseInfo
	// console.log('USERDBINFO', userDbInfo)
	// var dataItems=[];
	
	// for(var i = 0; i < userDbInfo; i++) {
	// 	dataItems.push(<li className="list-group-item" key={i}>userDbInfo[i]</li>)
	// 	console.log('DATAITEMS', dataItems)
	// }

			// <ul className="list-group">
				// {dataItems.map(function(item, i) {
				// 	return <li className="list-group-item">{item}</li>
				// })}

		// var dataItems=[];
		// {this.props.map((item, i) => {
		// 	<li className="list-group-item">{item}</li>
		// })}

				// {this.props.databaseInfo.map((item, i) => {
				// 	<li className="list-group-item" key={i}>{item}</li>
				// }})
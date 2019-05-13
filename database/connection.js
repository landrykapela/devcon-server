const db = require('mysql');

//database configurations
const config = require('./config.json').database;

//initiate connection to mysql database
exports.connect = () =>{
	con = db.createConnection({host: config.DB_HOST, user: config.DB_USER, password: config.DB_PWD, database: config.DB_NAME, port: config.DB_PORT});
	if(!con) throw "Not connected to db at localhost";
	console.log("Successfully connected to localhost db: "+config.DB_HOST);
	return con;
};

//check if table EXISTS
exports.tableExists = (con,tableName) =>{
	return new Promise((resolve,reject)=>{
		let sql = "SELECT * FROM information_schema.tables WHERE table_schema = '" + config.DB_NAME + "' AND table_name = '" + tableName +"' LIMIT 1";

		con.query(sql, (error,result)=>{
			if(error) reject("Table not found");
			else{
				if(result.length < 1) reject("Table not found");
				else resolve(result);
			}

		});
	});
}
exports.createTable = (con,data) =>{
	return new Promise((resolve,reject)=>{

			let tableName = data.tableName;
			let fields = data.fields;
			let sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(id int(10) auto_increment primary key, createdAt timestamp default now(), ";
			for(let i=0; i< fields.length; i++){
				let length = (fields[i].field_size !== undefined) ? "("+fields[i].field_size +")" : "" ;
				let required = (fields[i].required === true) ? " NOT NULL" : "";
				let unique  = (fields[i].unique !== undefined) ? ", UNIQUE KEY unique_" + fields[i].name+"("+fields[i].name+")" : "";
				let field = fields[i].name + " " + fields[i].type + length + required + unique;
				if(i < fields.length -1) field += ",";
				sql += field;
			}
			sql += ")";
				con.query(sql,(error, result)=>{
					if(!error){
						resolve(result);
					}
					else{
						reject(error);
					}
				});
		});
};

//get all records in a table
exports.findAllRecords = (con,table,fields,options) => {
	return new Promise((resolve,reject)=>{

			let field_string = "";
			if(fields.length == 0) field_string += " * ";
			else{
				for(let i=0; i < fields.length; i++){
					if(fields.length > 1 && i < (fields.length -1)){
						field_string += fields[i] + ", ";
					}
					else field_string += fields[i];
				}
			}
			let option_string = "";
			if(options){
				if(options.order_by){
					option_string += " ORDER BY "+ options.order_by;
				}
				if(options.order){
					option_string += " "+ options.order;
				}
				if(options.limit){
					option_string += " LIMIT "+ options.limit;
			}
			let sql = "SELECT " + field_string + " FROM " + table + option_string;
			con.query(sql,(error,result)=>{
				if(error) reject(error);
				else resolve(result);

			});
		}
	});
}
//get multiple records in a table
exports.findManyRecords = (con,table,fields,options,conditions) => {
	return new Promise((resolve,reject)=>{

			let field_string = "";
			if(fields.length == 0) field_string += " * ";
			else{
				for(let i=0; i < fields.length; i++){
					if(fields.length > 1 && i < (fields.length -1)){
						field_string += fields[i] + ", ";
					}
					else field_string += fields[i];
				}
			}
			//check order options
			let option_string = "";
			if(options){
				if(options.order_by){
					option_string += " ORDER BY "+ options.order_by;
				}
				if(options.order){
					option_string += " "+ options.order;
				}
				if(options.limit){
					option_string += " LIMIT "+ options.limit;
				}
			}
			//check conditions
			let condition_string = " ";
			if(conditions){
				for(let i=0; i< conditions.length; i++){
					condition_string += "WHERE " + "(" + conditions[i].variable + conditions[i].operation + (typeof conditions[i].value === 'string' ? "'" + conditions[i].value + "'" : conditions[i].value) + ")";
					let next = conditions[i+1];
					if(next){
							console.log(next);
						if(next.required){
							if(i == 0) condition_string += " AND ";
							else condition_string = " AND " + condition_string;
						}
						else {
							if( i== 0) condition_string += " OR ";
							else condition_string = " OR " + condition_string;
						}
					}
			}
			let sql = "SELECT " + field_string + " FROM " + table + condition_string + option_string;

			con.query(sql,(error,result)=>{
				if(error) reject(error);
				else resolve(result);
			});
		}
	});
}

//find single record with given options
exports.findSingleRecord = (con,table,conditions) =>{
	// options: {conditions:[{variable: "email", operation: "=", value: "landry@gmail.com"}]}

		return new Promise((resolve,reject)=>{

				let sql = "SELECT * FROM " +table+" WHERE ";
				for(let i=0; i< conditions.length; i++){
					let cond = "(" + conditions[i].variable + conditions[i].operation + (typeof conditions[i].value === 'string' ? "'"+conditions[i].value+"'" : conditions[i].value) + ")";
					let next = conditions[i+1];
					if(next){
							console.log(next);
						if(next.required){
							if(i == 0) cond += " AND ";
							else cond = " AND " + cond
						}
						else {
							if( i== 0) cond += " OR ";
							else cond = " OR " + cond;
						}
					}
					sql += cond;
				}
				sql += " LIMIT 1";

				con.query(sql,(error,result,fields)=>{
					 if(error) reject(error);
					 else resolve(result);
				});
		});
		// if(error) throw error;

};

exports.insertSingleRecord = (con,table,data) =>{
	return new Promise((resolve,reject)=>{

			let availableFields = Object.keys(data);
			let availableValues = Object.values(data);
			let values = " (";
			let fields = " (";
			for(let i=0; i< availableFields.length; i++){
				fields += availableFields[i];
				values += typeof availableValues[i] === 'string' ? "'"+ availableValues[i] + "'" : availableValues[i];
				if(i < (availableFields.length - 1)){
					fields += ",";
					values += ",";
				}
				else {
					fields += ") ";
					values += ") ";
				}
			}
			let sql = "INSERT INTO " + table + fields + "VALUES " + values;

			con.query(sql,(error,result)=>{
				console.log(result);
				if(error) reject(error);
				resolve(result);
			});
		});
};

exports.updateRecord = (con, table,data,conditions) =>{
	return new Promise((resolve,reject)=>{

			let sql = "UPDATE " + table + " SET ";
			//values to set
			let x = "";
			//condition
			let y = "";
			let keys = Object.keys(data);
			let values = Object.values(data);
			for(let k=0; k<keys.length;k++){
				if(k < keys.length -1) {
					 x += keys[k] + "=" + values[k] + ",";
				}
				else {
					 x += keys[k] + "=" + values[k];
				}
			}
			for(let i=0; i< conditions.length; i++){
				let cond = "(" + conditions[i].variable + conditions[i].operation + (typeof conditions[i].value === 'string' ? "'"+conditions[i].value+"'" : conditions[i].value) + ")";
				let next = conditions[i+1];
				if(next){
						console.log(next);
					if(next.required){
						if(i == 0) cond += " AND ";
						else cond = " AND " + cond
					}
					else {
						if( i== 0) cond += " OR ";
						else cond = " OR " + cond;
					}
				}
				y += cond;
			}
			sql += x;
			sql += " WHERE " + y;
			console.log(sql);
			con.query(sql,(error,result)=>{
				console.log("connection result:" + error);
				resolve(result);
			});
		});
};

//delete single record
exports.deleteOneRecord = (con, table, conditions) =>{

	return new Promise((resolve,reject)=>{
		let y = " WHERE ";
		for(let i=0; i< conditions.length; i++){
			let cond = "(" + conditions[i].variable + conditions[i].operation + (typeof conditions[i].value === 'string' ? "'"+conditions[i].value+"'" : conditions[i].value) + ")";
			let next = conditions[i+1];
			if(next){
					console.log(next);
				if(next.required){
					if(i == 0) cond += " AND ";
					else cond = " AND " + cond
				}
				else {
					if( i== 0) cond += " OR ";
					else cond = " OR " + cond;
				}
			}
			y += cond;
		}
		let sql = "DELETE FROM " + table + y;
		con.query(sql,(error,result)=>{
			if(error) reject(error);
			else resolve(result);
		});
	});

}

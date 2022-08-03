const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var boardSchema = new mongoose.Schema({
	writer: String, // 쓴 사람의 token
	title: String, // 글 제목
	content: String, // 글 내용
	boardToken: String, // 글 고유 값
	writeDate: { type: Date, default: new Date() }, // 글 작성 날짜
});


module.exports = mongoose.model('Board', boardSchema);

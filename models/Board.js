const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var boardSchema = new mongoose.Schema({
	writer: String, // 쓴 사람의 token
	title: String, // 글 제목
	content: String, // 글 내용
	boardToken: String, // 글 고유 값
    category: String, // 제품 카테고리
	writeDate: { type: Date, default: new Date() }, // 글 작성 날짜
    comment: [
		{
            isPrivate: Boolean, // 댓글 비공개 여부
			username: String, // 댓글 작성자 이름
			content: String, // 댓글 내용
			date: { type: Date, default: new Date() }, // 작성 시간
		},
	], // 댓글
});


module.exports = mongoose.model('Board', boardSchema);

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Board = require("../../models/Board");
const randomString = require("randomstring");


// 글 작성
router.post(
	'/add', 
	async (req, res) => {
	let new_board = new Board({
		writer: req.body.token,
		title: req.body.title,	
		content: req.body.content,
		boardToken: randomString.generate(12), // 랜덤한 문자열 12자리 생성
	});

	try {
		await new_board.save();
		return res.status(200).json({ data: new_board });
	} catch (e) {
		return res.status(500).json({ message: 'add Fail' });
	}
});

// 글 리스트 불러오기
router.get(
	'/getList', 
	async (req, res) => {
	let list = await Board.find(); // 전체 리스트 불러오기.
	return res.status(200).json({ data: list });
});

// 글 불러오기
router.get(
	'/get/:boardToken', 
	async (req, res) => {
	let board = await Board.findOne({ noticeToken: req.params.boardToken });
	if (board) {
		let user = await User.findOne({ token: board.writer }); // 작성자 이름을 얻기 위해, 토큰으로 검색
		return res.status(200).json({ data: { ...board._doc, writerName: user.name } });
	}
	return res.status(500).json({ message: 'Notice Not Found' });
});

// 글 삭제
router.post(
	'/del', 
	async (req, res) => {
	let result = await Board.deleteOne({ boardToken: req.body.boardToken, writer: req.body.token });
	if (result.ok) return res.status(200).json({ message: 'success!' });
	else return res.status(500).json({ message: 'Delete Fail!' });
});

// 글 수정
router.post(
	'/modify', 
	async (req, res) => {
	let result = await Board.updateOne(
		{
			boardToken: req.body.boardToken,
			writer: req.body.token,
		},
		{ $set: { content: req.body.content } }
	);
	if (result.ok) return res.status(200).json({ message: 'success!' });
	else return res.status(500).json({ message: 'Delete Fail!' });
});

module.exports = router;
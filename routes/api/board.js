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
		category: req.body.category,
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
	return res.status(500).json({ message: 'Board Not Found' });
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

// 글 검색
router.get('/search/:keyword', async (req, res) => {
	let result = await Board.find({ title: {$regex: req.params.keyword } });
	return res.status(200).json({ data: result });
});

// 카테고리 조회
router.get('/get/:category', async (req, res) => {
	let list = await Board.find({ category: req.params.category }); // 카테고리 리스트 불러오기.
	return res.status(200).json({ data: list });
}
)
// 댓글 달기
router.post('/comment/add', async (req, res) => {
	let user = await User.findOne({ token: req.body.token }); // 댓글 작성할 유저
	let board = await Board.findOne({ noticeToken: req.body.boardToken });

	board.comment.push({
		// 따라서 이러한 문법을 복잡한 update query 없이 사용할 수 있습니다.
		username: user.name,
		content: req.body.content,
	});
	try {
		await board.save(); // 가져오고 수정한 notice를 다시 save합니다.
		return res.status(200).json({ message: 'success!' });
	} catch (e) {
		return res.status(500).json({ message: 'Save Fail!' });
	}
});
module.exports = router;
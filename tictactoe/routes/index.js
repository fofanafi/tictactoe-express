
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('/tictactoe.html');
  //res.render('index', { title: 'Express' })
};

export function get(req, res) {
    res.json(req.session.user)
}

export function put(req, res){
    req.session.user = req.body;
    res.json({msg: 'success'})
}
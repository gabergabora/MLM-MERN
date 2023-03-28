import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/users.js';
import Tree from '../models/tree.js';

export const register = async (req, res) => {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
        return res.send("409");
    }
    try {
        var salt = bcryptjs.genSaltSync(10);
        var hash = bcryptjs.hashSync(req.body.password, salt);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hash
        }
        const newuser = new User(user);
        await newuser.save();
        res.status(201).json('newuser');

    } catch (error) {
        console.log(error)
    }

}
export const login = async (req, res) => {
    //console.log('process.env.JWT'); return;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            //next(createError(404,"User Not Found!"));
            return res.send("404");
        }
        const passwordDB = user.password;
        const matchPasswotd = await bcryptjs.compare(req.body.password, passwordDB);

        if (matchPasswotd === false) {
            return res.send("400");
        }

        //now remove Password and isAdmin from User get from query as follows   
        //const { Password, isAdmin, ...otherDetails } = User;   
        //since in output of return response.json({...otherDetails}); I am getting collectable values in _doc variable so
        const { password, ...otherDetails } = user._doc;
        //now I have to install a jwt here. first install npm install jsonwebtoken and create jwt via openssl>rand -base64 32 and put it to .env file for privacy. And now create token with sign jwt token with user id and isadmin as
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "2d" });
        //now put this token in a cookie by installing npm install cookie-parser. After this initialize this cookie-parser in index.js as app.use() and send back a cookie in response to browser with created token
        //res.cookie('access_token',token,{expire : 36000 + Date.now(), httpOnly:true}).status(200).json({...otherDetails});
        otherDetails.access_token = token;
        res.cookie('access_token', token, { maxAge: (2 * 24 * 60 * 60 * 1000) /* cookie will expires in 2 days*/, httpOnly: true }).status(201).json({ ...otherDetails });

    } catch (error) {
        res.status(400).json({ message: error.message });
        // next(error);
    }
}
export const logout = async (request, response) => {
    try {
        response.clearCookie('access_token');
        response.status(201).json('User Logged out successfully!!');

    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}
export const join = async (request, response, next) => {
    // console.log(request.body.side); return;
    let flag = 0;
    try {
        let emailavailcheck = await email_check(request.body.email);
        let underEmailCheck = await email_check(request.body.under_useremail);
        let side = await side_check(request.body.under_useremail, request.body.side);
        // console.log(emailavailcheck); return;
        if (emailavailcheck) {
            if (!underEmailCheck) {
                if (side === 1) {
                    //Side check
                    flag = 1;
                }
                else {
                    return response.send("401");//.json('The side you selected is not available.');
                }
            }
            else {
                return response.send("402");//.json('Invalid Under Email.');
            }
        }
        else {
            //check email
            return response.send("403");//.json('This user id(Email) is already availble.');
        }
        // console.log(flag); return;
        if (flag == 1) {
            var salt = bcryptjs.genSaltSync(10);
            var hash = bcryptjs.hashSync('12345678', salt);
            const user = {
                name: request.body.name,
                email: request.body.email,
                password: hash,
                under_useremail: request.body.under_useremail
            }
            const newuser = new User(user);
            await newuser.save();   ///saved user to User collection

            const treeBody = {
                useremail: request.body.email,
            }
            //  console.log(treeBody);
            const newtree = new Tree(treeBody);
            await newtree.save();   ///insert useremail to Tree collection


            let side = request.body.side;
            const treeBodyUpdate = {
                [side]: request.body.email
            }
            await Tree.updateOne({ useremail: request.body.under_useremail }, treeBodyUpdate);
            //return;
            let next_under_userid = '';
            let current_temp_side_count;
            let temp_under_userid = request.body.under_useremail;
            let temp_side_count = request.body.side + 'count'; //leftcount or rightcount
            let temp_side = request.body.side;
            let total_count = 1;
            let i = 1;

            while (total_count > 0) {
                let TreeVals = await Tree.find({ useremail: request.body.under_useremail }).count();
                // console.log(TreeVals); return;
                if (TreeVals == 0) {
                    current_temp_side_count = 0;   //updating count initial user
                }
                else {
                    let TreeValsmain = await Tree.find({ useremail: request.body.under_useremail });
                    current_temp_side_count = TreeValsmain[0][temp_side_count] + 1;
                }

                temp_under_userid;
                temp_side_count;

                const treeBodyUpdate1 = {
                    [temp_side_count]: current_temp_side_count
                }
                await Tree.updateOne({ useremail: temp_under_userid }, treeBodyUpdate1);

                next_under_userid = await getUnderId(temp_under_userid);
                temp_side = await getUnderIdPlace(temp_under_userid);
                temp_side_count = temp_side + 'count';
                temp_under_userid = next_under_userid;
                if (temp_under_userid == "") {
                    total_count = 0;
                }
            }
            response.status(201).json(request.body.email + ' user joined successfully under ' + request.body.under_useremail + ' !!');
        }
    } catch (error) {
        next(error);
    }
}
const getUnderId = async (id) => {
    let res = await User.find({ email: id });
    return res[0]['under_useremail'];
}
const getUnderIdPlace = async (id) => {
    let res = await User.find({ email: id });
    return res[0]['side'];

}

let side_check = async (underemail, side) => {
    let sideAvailableCount = await Tree.find({ $and: [{ useremail: underemail }, { side: { $eq: null } }] }).count();
    let sideAvailable = await Tree.find({ $and: [{ useremail: underemail }, { side: { $eq: null } }] });
    if (sideAvailableCount == 0 || (typeof (sideAvailable[0][side]) != 'undefined' && sideAvailable[0][side] == '') || (typeof (sideAvailable[0][side]) === 'object' && sideAvailable[0][side] == null)) {

        return 1;
    }
    else {
        return 0;
    }
}
let email_check = async (emails) => {
    // console.log(emails);
    let emailAvailableCount = await User.find({ email: emails }).count();
    //console.log(emailAvailableCount); //return;
    if (emailAvailableCount > 0) {
        return false;
    }
    else {
        return true;
    }
}
export const tree = async (request, response, next) => {
    try {
        let return_array = [];
        let treeLeft = '';
        let treeRight = '';
        let tree = await Tree.find({ useremail: request.params.id });
        //  console.log(tree[0]['rightcount'] + '=' + tree[0]['rightcount']);
        if (tree) {
            if (tree.length === 0) {
                response.status(201).json(tree);
            }
            else if ((typeof (tree[0]['leftcount']) != 'undefined' && tree[0]['leftcount'] == 1) && (typeof (tree[0]['rightcount']) != 'undefined' && tree[0]['rightcount'] == 1)) {
                response.status(201).json(tree);
            }
            else if ((typeof (tree[0]['leftcount']) != 'undefined' && tree[0]['leftcount'] == 1) && (typeof (tree[0]['rightcount']) != 'undefined' && tree[0]['rightcount'] == 0)) {
                response.status(201).json(tree);
            }
            else if ((typeof (tree[0]['leftcount']) != 'undefined' && tree[0]['leftcount'] == 0) && (typeof (tree[0]['rightcount']) != 'undefined' && tree[0]['rightcount'] == 1)) {
                response.status(201).json(tree);
            }
            else if ((typeof (tree[0]['leftcount']) != 'undefined' && tree[0]['leftcount'] >= 1) && (typeof (tree[0]['rightcount']) != 'undefined' && tree[0]['rightcount'] >= 1) || (typeof (tree[0]['leftcount']) != 'undefined' && tree[0]['leftcount'] > 1) && (typeof (tree[0]['rightcount']) != 'undefined' && tree[0]['rightcount'] > 1)) {
                treeLeft = await Tree.find({ useremail: tree[0]['left'] });
                treeRight = await Tree.find({ useremail: tree[0]['right'] });
                return_array.push(tree);
                return_array.push(treeLeft);
                return_array.push(treeRight);
                response.status(201).json(return_array);
            }
            else if (typeof (tree[0]['leftcount']) != 'undefined' && typeof (tree[0]['rightcount']) != 'undefined') {
                //console.log(tree.length);
                response.status(201).json(tree);
            }
            else {
                response.status(201).json(tree);

            }
        }
    } catch (error) {
        next(error);
    }
}

























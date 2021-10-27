const jwt = require('jsonwebtoken');
const con = require('../../app/connect/connect');
const configJWT = require('../config/configJWT');
require('dotenv').config()

//main function fot query sql
function querySQL(sql){
    return new Promise(function (resolve, reject){
        con.query(sql , (err,results) => {
            if(err) throw reject(err);
            resolve(results);
        });
    });
}

exports.checkLogin = async (req, res) => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    try {
        let sql = `SELECT id_member, id_status_member, id_status_member_on, id_account, email_member FROM tb_members WHERE email_member = '${req.body.email}' AND password = '${req.body.password}'`;
        let check_user = await querySQL(sql);
        if (check_user.length === 1) {
            if((check_user[0].id_status_member === 1 || check_user[0].id_status_member === 1729384732) && check_user[0].id_status_member_on !== 2) {
                const data_user = {
                    id_member: check_user[0].id_member,
                    id_status_member: check_user[0].id_status_member,
                    id_account: check_user[0].id_account,
                    email_member: check_user[0].email_member
                }
                jwt.sign({ data_user }, process.env.secretkey, { expiresIn: '6h' }, (err, token) => {
                    configJWT.pushTokenToValidateList(token.toString());
                    let sql_last_login = `UPDATE tb_members SET last_login = '${year}-${month}-${day}' WHERE id_member = ${check_user[0].id_member}`;
                    con.query(sql_last_login , (err,results) => {
                        if(err) {
                            throw err;
                        }
                        else {
                            res.json({
                                status: 1,
                                id_account: check_user[0].id_account,
                                id_status_member: check_user[0].id_status_member,
                                token: token
                            });
                        }
                    });
                })
            }
            else {
                res.json({
                    status: 2,
                    msg: 'your account not approved'
                })
            }
        } else {
            res.json({
                status: 0,
                msg: "You entered an incorrect email or password"
            });
        }
    } catch (err) {
        console.log(err.message);
        res.json({
            status: 0,
            msg: err.message
        });
    }
}

exports.deleteTokenInValidateTokenList = (req, res) => {
    configJWT.deleteTokenInValidateTokenList(req.body.token);
    res.json({
        status: 1,
        msg: 'Logout success'
    });
}
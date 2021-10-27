const escapeOutput = require('../config/configEscape');
const querySQL = require('../config/configQuerySQL');
const { verifyJWT } = require('../config/configJWT');
const transporter = require('../config/configNodemailer');
const { deleteFile } = require('../config/configDeleteFiles');
const fs = require("fs");

exports.getMembers = async (req, res) => {

    try {
        let v_token = await verifyJWT(req.token);
        if(v_token.data_user.id_status_member === 1729384732) {
            const sql_getMember = `SELECT @n := @n + 1 no, id_member, id_status_member_on, id_account, fname, lname, email_member, company, last_login FROM tb_members, (SELECT @n := 0) m WHERE id_status_member = 1`;
            const getMembers = await querySQL(sql_getMember);
    
            if(getMembers) {
                res.json({
                    status: 1,
                    members: getMembers
                });
            }
            else {
                res.json({
                    status:2,
                    msg: 'get data failed'
                });
            }
        }
        else {
            res.sentStatus(403);
        }
    } catch (error) {
        console.log(error.message)
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.updateStatusAccount = async (req, res) => {
    const id_member = parseInt(req.body.id_member);
    const id_status_member_update = parseInt(req.body.id_status_member_on);
    const id_status_member = parseInt(req.body.status);

    try {
        let v_token = await verifyJWT(req.token);
        if(v_token.data_user.id_status_member === id_status_member) {
            if(v_token.data_user.id_status_member === 1729384732) {
                const sql_update_status = `UPDATE tb_members SET id_status_member_on = ${id_status_member_update} WHERE id_member = ${id_member}`;
                const r_update_status = await querySQL(sql_update_status);
                if(r_update_status) {
                    const sql_getEmail = `SELECT email_member FROM tb_members WHERE id_account = ${v_token.data_user.id_account}`;
                    const r_getEmail = await querySQL(sql_getEmail);
                    if (r_getEmail) {
                        let mailOptions = '';
                        if(id_status_member_update === 1) {
                            mailOptions = {
                                from: 'nodemailerTour@gmail.com',
                                to: r_getEmail[0].email_member,
                                subject: 'Hello from Tour Management',
                                html: '<b>Your account is approved.</b>'
                            };
                        }
                        else {
                            mailOptions = {
                                from: 'nodemailerTour@gmail.com',
                                to: r_getEmail[0].email_member,
                                subject: 'Hello from Tour Management',
                                html: '<b>Your account is Waiting.</b>'
                            };
                        }
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err) {
                                // console.log(err)
                                res.json({
                                    status: 1,
                                    msg: err
                                });
                            }
                            else {
                                // console.log(info);
                                res.json({
                                    status: 1,
                                    msg: "update status successfully"
                                });
                            }
                        });
                    }
                    else {
                        res.json({
                            status: 1,
                            msg: "update status failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 1,
                        msg: "update status failed"
                    });
                }
            }
            else {
                res.sentStatus(403);
            }
        }
        else {
            res.sentStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.getFilesConsider = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if(v_token.data_user.id_status_member === 1729384732) {
            const sql_getFiles = `SELECT file_name, mimetype FROM tb_files_register WHERE id_account = ${parseInt(req.body.id_account)}`;
            const r_getFiles = await querySQL(sql_getFiles);
            if(r_getFiles) {
                res.json({
                    status: 1,
                    files: r_getFiles,
                    msg: "get files successfully"
                });
            }
            else {
                res.json({
                    status: 0,
                    msg: "get files failed"
                });
            }
        }
        else {
            res.sentStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.readFile = async (req, res) => {
    try {
        let v_token = await verifyJWT(req.token);
        if (v_token) {
            if (parseInt(v_token.data_user.id_status_member) === 1729384732) {
                var file = fs.createReadStream(`./public/filesRegister/${req.body.file_name}`);
                file.pipe(res);
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
    catch(err) {
        console.log(err.message);
        res.json({
            status: 0,
            msg: err.message
        });
    }
}

exports.deleteAccount = async (req, res) => {
    const id_account = parseInt(req.body.id_account);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1729384732) {
                const sql_del_account = `DELETE FROM tb_members WHERE id_account = ${id_account}`;
                const r_del_account = await querySQL(sql_del_account);
                if (r_del_account) {
                    const sql_get_files = `SELECT file_name FROM tb_files_register WHERE id_account = ${id_account}`;
                    const r_get_files = await querySQL(sql_get_files);
                    for (let i = 0; i < r_get_files.length; i++) {
                        deleteFile(r_get_files[i].file_name);
                    }
                    res.json({
                        status: 1,
                        msg: "Delete account successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "Delete account failed"
                    });
                }
            }
            else {
                res.sentStatus(403);
            }
        }
        else {
            res.sentStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}
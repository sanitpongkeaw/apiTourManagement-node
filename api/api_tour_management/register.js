const escapeOutput = require('../config/configEscape');
const querySQL = require('../config/configQuerySQL');

exports.checkEmail = async (req, res) => {
    try {
        const sql = `SELECT email_member FROM tb_members WHERE email_member = '${req.body.email}'`;
        const check_email = await querySQL(sql);
        console.log(req.body.email)
        console.log(check_email)
        console.log(check_email.length)
        if (check_email.length > 0) {
            res.json({
                status: 2,
                msg: 'email equal'
            });
        }
        else {
            res.json({
                status: 1,
                msg: 'email pass'
            });
        }
    }
    catch (err) {
        console.log(err.message);
        res.json({
            status: 0,
            msg: err.message
        });
    }
}

exports.insertAuth = async (req, res) => {
    const company = escapeOutput(req.body.company);
    const email = escapeOutput(req.body.email);
    const password = req.body.password;
    const fname = escapeOutput(req.body.fname);
    const lname = escapeOutput(req.body.lname);
    const address = escapeOutput(req.body.address);
    const country = escapeOutput(req.body.country);
    const mobile = escapeOutput(req.body.mobile);
    const date = new Date();
    const year = date.getFullYear();
    try {
        const sql_id = `SELECT id_member FROM tb_members ORDER BY id_member DESC LIMIT 1`;
        const get_id = await querySQL(sql_id);
        let str = "" + (get_id[0].id_member + 1);
        let pad = "000000";
        let ans = pad.substring(0, pad.length - str.length) + str;
        const id_account = year.toString() + ans;

        const sql_insert_register = `INSERT INTO tb_members (id_status_member, id_status_member_on, id_account, email_member, password, fname, lname, company, address, country, mobile_number) VALUES (${parseInt(1)}, ${parseInt(2)}, ${id_account}, '${email}', '${password}', '${fname}', '${lname}', '${company}', '${address}', '${country}', '${mobile}')`;
        const insert_register = await querySQL(sql_insert_register);
        
        if(insert_register) {
            let sql_add_files = `INSERT INTO tb_files_register (id_account, file_name, mimetype) VALUES `;
            for(let i = 1; i <= req.files.filesConsider.length; i++) {
                if(i !== req.files.filesConsider.length) {
                    sql_add_files += `(${id_account}, '${req.files.filesConsider[i-1].filename}', '${req.files.filesConsider[i-1].mimetype}'),`;
                }
                else {
                    sql_add_files += `(${id_account}, '${req.files.filesConsider[i-1].filename}', '${req.files.filesConsider[i-1].mimetype}')`;
                }
            }
            const add_files = await querySQL(sql_add_files);
            if(add_files) {
                res.json({
                    status: 1,
                    msg: 'register successfully'
                });
            }
            else {
                res.json({
                    status: 0,
                    msg: 'register failed'
                });
            }
        }
        else {
            res.json({
                status: 0,
                msg: 'register failed'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}
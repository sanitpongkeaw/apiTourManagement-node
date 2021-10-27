const escapeOutput = require('../config/configEscape');
const querySQL = require('../config/configQuerySQL');
const { verifyJWT } = require('../config/configJWT');
const transporter = require('../config/configNodemailer');

exports.getToutList = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getTourList = `SELECT id_data_tour, tour_name, type FROM tb_data_tours`;
                const r_getTourList = await querySQL(sql_getTourList);
                if (r_getTourList) {
                    res.json({
                        status: 1,
                        msg: "get tour list successfully",
                        tour: r_getTourList
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get tour list failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.addPackage = async (req, res) => {
    const id_data_tour = parseInt(req.body.id_data_tour); 
    const tourName = escapeOutput(req.body.tourName);
    const packageName = escapeOutput(req.body.packageName);
    const dateStart = req.body.dateStart;
    const dateEnd = req.body.dateEnd;
    const minimum_person = req.body.minimum_person;
    const numberOfTicket = req.body.numberOfTicket;
    const cutOff = req.body.cutOff;
    const mulPriceAdult = req.body.mulPriceAdult;
    const mulPriceChild = req.body.mulPriceChild;
    const onePriceAdult = req.body.onePriceAdult;
    const onePriceChild = req.body.onePriceChild;
    const packageDetails = req.body.packageDetails;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_insertPackage = `INSERT INTO tb_package_tours (id_data_tour, id_account, id_status_stop_sell, tour_name_package, package_name, date_start, date_end, minimum_person, number_of_ticket, cut_off, 2_3_person_per_room_adult, 2_3_person_per_room_child, 1_person_per_room_adult, 1_person_per_room_child, package_detail, last_insert_package) VALUES (${id_data_tour}, ${v_token.data_user.id_account}, ${2}, '${tourName}', '${packageName}', '${dateStart}', '${dateEnd}', '${minimum_person}', '${numberOfTicket}', '${cutOff}', '${mulPriceAdult}', '${mulPriceChild}', '${onePriceAdult}', '${onePriceChild}', '${packageDetails}', '${year}-${month}-${day}')`;
                const r_insertPackage = await querySQL(sql_insertPackage);
                if (r_insertPackage) {
                    res.json({
                        status: 1,
                        msg: "insert package successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "insert package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.getPackages = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_getPackage = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_getPackage = `SELECT @n := @n + 1 no, a.id_package_tour, a.id_status_approve, a.tour_name_package, a.package_name, a.last_insert_package, b.fname, b.lname FROM tb_package_tours as a LEFT JOIN tb_members as b ON a.id_account = b.id_account, (SELECT @n := 0) m`;
                }
                else {
                    sql_getPackage = `SELECT @n := @n + 1 no, id_package_tour, id_status_approve, tour_name_package, package_name, last_insert_package FROM tb_package_tours, (SELECT @n := 0) m WHERE id_account = ${v_token.data_user.id_account}`;
                }

                const r_getPackage = await querySQL(sql_getPackage);
                if (r_getPackage) {
                    res.json({
                        status: 1,
                        msg: "get package successfully",
                        package: r_getPackage
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.deletePackage = async (req, res) => {
    const id_package = parseInt(req.body.id_package);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_deletePackage = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_deletePackage = `DELETE FROM tb_package_tours WHERE id_package_tour = ${id_package}`;
                }
                else {
                    sql_deletePackage = `DELETE FROM tb_package_tours WHERE id_package_tour = ${id_package} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_deletePackage = await querySQL(sql_deletePackage);

                if (r_deletePackage) {
                    res.json({
                        status: 1,
                        msg: "delete package successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "delete package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.getTourPackage = async (req, res) => {
    const id_package = parseInt(req.params.idPackage);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_getTourPackage = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_getTourPackage = `SELECT id_data_tour, package_name, date_start, date_end, minimum_person, number_of_ticket, cut_off, 2_3_person_per_room_adult as mulPriceAdult, 2_3_person_per_room_child as mulPriceChild, 1_person_per_room_adult as onePriceAdult, 1_person_per_room_child as onePriceChild, package_detail FROM tb_package_tours WHERE id_package_tour = ${id_package}`;
                }
                else {
                    sql_getTourPackage = `SELECT id_data_tour, package_name, date_start, date_end, minimum_person, number_of_ticket, cut_off, 2_3_person_per_room_adult as mulPriceAdult, 2_3_person_per_room_child as mulPriceChild, 1_person_per_room_adult as onePriceAdult, 1_person_per_room_child as onePriceChild, package_detail FROM tb_package_tours WHERE id_package_tour = ${id_package} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_getTourPackage = await querySQL(sql_getTourPackage);
                if (r_getTourPackage) {
                    const sql_getTour = `SELECT id_data_tour, tour_name, type FROM tb_data_tours WHERE id_data_tour = ${r_getTourPackage[0].id_data_tour}`;
                    const r_getTour = await querySQL(sql_getTour);
                    if (r_getTour) {
                        const sql_getTourList = `SELECT id_data_tour, tour_name, type FROM tb_data_tours`;
                        const r_getTourList = await querySQL(sql_getTourList);
                        if (r_getTourList) {
                            res.json({
                                status: 1,
                                msg: "get tour edit successfully",
                                tourListEdit: r_getTour,
                                tour: r_getTourList,
                                package: r_getTourPackage
                            });
                        }
                        else {

                        }
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "get tour edit failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get id tour failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.updatePackage = async (req, res) => {
    const idPackage = parseInt(req.body.idPackage);
    const id_data_tour = parseInt(req.body.id_data_tour);
    const tourName = escapeOutput(req.body.tourName);
    const packageName = escapeOutput(req.body.packageName);
    const dateStart = req.body.dateStart;
    const dateEnd = req.body.dateEnd;
    const minimum_person = parseInt(req.body.minimum_person);
    const numberOfTicket = parseInt(req.body.numberOfTicket);
    const cutOff = parseInt(req.body.cutOff);
    const mulPriceAdult = parseInt(req.body.mulPriceAdult);
    const mulPriceChild = parseInt(req.body.mulPriceChild);
    const onePriceAdult = parseInt(req.body.onePriceAdult);
    const onePriceChild = parseInt(req.body.onePriceChild);
    const packageDetails = req.body.packageDetails;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_updatePackage = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_updatePackage = `UPDATE tb_package_tours SET id_data_tour = ${id_data_tour}, tour_name_package = '${tourName}', package_name = '${packageName}', date_start = '${dateStart}', date_end = '${dateEnd}', minimum_person = '${minimum_person}', number_of_ticket = '${numberOfTicket}', cut_off = '${cutOff}', 2_3_person_per_room_adult = '${mulPriceAdult}', 2_3_person_per_room_child = '${mulPriceChild}', 1_person_per_room_adult = '${onePriceAdult}', 1_person_per_room_child = '${onePriceChild}', package_detail = '${packageDetails}', last_insert_package = '${year}-${month}-${day}' WHERE id_package_tour = ${idPackage}`;
                }
                else {
                    sql_updatePackage = `UPDATE tb_package_tours SET id_data_tour = ${id_data_tour}, tour_name_package = '${tourName}', package_name = '${packageName}', date_start = '${dateStart}', date_end = '${dateEnd}', minimum_person = '${minimum_person}', number_of_ticket = '${numberOfTicket}', cut_off = '${cutOff}', 2_3_person_per_room_adult = '${mulPriceAdult}', 2_3_person_per_room_child = '${mulPriceChild}', 1_person_per_room_adult = '${onePriceAdult}', 1_person_per_room_child = '${onePriceChild}', package_detail = '${packageDetails}', last_insert_package = '${year}-${month}-${day}' WHERE id_package_tour = ${idPackage} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_updatePackage = await querySQL(sql_updatePackage);

                if (r_updatePackage) {
                    res.json({
                        status: 1,
                        msg: "update package successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.updateStatusPackage = async (req, res) => {
    const id_package = parseInt(req.body.id_package);
    const id_status_approve = parseInt(req.body.id_status_approve);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_updateStatusPackage = `UPDATE tb_package_tours SET id_status_approve = ${id_status_approve} WHERE id_package_tour = ${id_package}`;
                const r_updateStatusPackage = await querySQL(sql_updateStatusPackage);

                if (r_updateStatusPackage) {
                    res.json({
                        status: 1,
                        msg: "update status package successfully"
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "update status package failed"
                    });
                }
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}

exports.getPackageList = async (req, res) => {
    const id_data_tour = parseInt(req.params.id_data_tour);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            const sql_getPackage = `SELECT id_package_tour, package_name FROM tb_package_tours WHERE id_data_tour = ${id_data_tour} AND id_account = ${v_token.data_user.id_account}`;
            const r_getPackage = await querySQL(sql_getPackage);

            if (r_getPackage) {
                res.json({
                    status: 1,
                    msg: "get package successfully",
                    package: r_getPackage
                });
            }
            else {
                res.json({
                    status: 0,
                    msg: "get package failed"
                });
            }
        }
        else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 0,
            msg: error.message
        });
    }
}
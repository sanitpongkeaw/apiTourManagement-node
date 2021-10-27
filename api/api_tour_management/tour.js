const escapeOutput = require('../config/configEscape');
const querySQL = require('../config/configQuerySQL');
const { verifyJWT } = require('../config/configJWT');
const { deleteFileTour } = require('../config/configDeleteFiles');
const transporter = require('../config/configNodemailer');

/* ------------------------------------ Agent ------------------------------------ */

exports.addTour = async (req, res) => {
    const tourName = escapeOutput(req.body.tourName);
    const address = escapeOutput(req.body.address);
    const contact = escapeOutput(req.body.contact);
    const type = escapeOutput(req.body.type);
    const star = escapeOutput(req.body.star);
    const email = escapeOutput(req.body.email);
    const destinationMP1 = escapeOutput(req.body.destinationMP1);
    const detailMP1 = escapeOutput(req.body.detailMP1);
    const destinationMP2 = escapeOutput(req.body.destinationMP2);
    const detailMP2 = escapeOutput(req.body.detailMP2);
    const highlight = req.body.highlight;
    const content = req.body.content;
    const includes = req.body.includes;
    const excludes = req.body.excludes;
    const youNeedToKnow = req.body.youNeedToKnow;
    const howToTravel = req.body.howToTravel;
    const cancellationPolicy = req.body.cancellationPolicy;
    const previewImage = req.files.previewImage[0].filename;
    const id_status_member = parseInt(req.body.id_status_member);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    
    try {
        const v_token = await verifyJWT(req.token);
        if(v_token) {
            if (v_token.data_user.id_status_member === id_status_member) {
                if (v_token.data_user.id_status_member === 1) {
                    const sql_insertTour = `INSERT INTO tb_data_tours (id_account, id_status_approve, tour_name, tour_address, tour_contact_number, type, star, tour_email, preview_img_name, meeting_p_1, detail_meeting_p_1, meeting_p_2, detail_meeting_p_2, highlight, content, includes, excludes, you_need_to_know, how_to_travel, cancellation_policy, last_insert_tour) VALUES (${parseInt(v_token.data_user.id_account)}, ${2}, '${tourName}', '${address}', '${contact}', '${type}', '${star}', '${email}', '${previewImage}', '${destinationMP1}', '${detailMP1}', '${destinationMP2}', '${detailMP2}', '${highlight}', '${content}', '${includes}', '${excludes}', '${youNeedToKnow}', '${howToTravel}', '${cancellationPolicy}', '${year}-${month}-${day}')`;
                    const r_insertTour = await querySQL(sql_insertTour);
                    if (r_insertTour) {
                        if (req.files.photos) {
                            let sql_insertPhoto = `INSERT INTO tb_img_data_tour (id_data_tour, name_img_data_tour) VALUES `;
                            for (let i = 1; i <= req.files.photos.length; i++) {
                                if(i !== req.files.photos.length) {
                                    sql_insertPhoto += `(${r_insertTour.insertId}, '${req.files.photos[i-1].filename}'),`;
                                }
                                else {
                                    sql_insertPhoto += `(${r_insertTour.insertId}, '${req.files.photos[i-1].filename}')`;
                                }
                            }
                            const r_insertPhoto = await querySQL(sql_insertPhoto);
                        }
    
                        if (req.files.photosMP1) {
                            let sql_insertPhotosMP1 = `INSERT INTO tb_img_data_tours_meeting_p_1 (id_data_tour, name_img_data_tour_meeting_p_1) VALUES `;
                            for(let i = 1; i <= req.files.photosMP1.length; i++) {
                                if (i !== req.files.photosMP1.length) {
                                    sql_insertPhotosMP1 += `(${r_insertTour.insertId}, '${req.files.photosMP1[i-1].filename}'),`;
                                }
                                else {
                                    sql_insertPhotosMP1 += `(${r_insertTour.insertId}, '${req.files.photosMP1[i-1].filename}')`;
                                }
                            }
                            const r_insertPhotosMP1 = await querySQL(sql_insertPhotosMP1);
                        }
    
                        if (req.files.photosMP2) {
                            let sql_insertPhotosMP2 = `INSERT INTO tb_img_data_tours_meeting_p_2 (id_data_tour, name_img_data_tour_meeting_p_2) VALUES `;
                            for(let i = 1; i <= req.files.photosMP2.length; i++) {
                                if (i !== req.files.photosMP2.length) {
                                    sql_insertPhotosMP2 += `(${r_insertTour.insertId}, '${req.files.photosMP2[i-1].filename}'),`;
                                }
                                else {
                                    sql_insertPhotosMP2 += `(${r_insertTour.insertId}, '${req.files.photosMP2[i-1].filename}')`;
                                }
                            }
                            const r_insertPhotosMP2 = await querySQL(sql_insertPhotosMP2);
                        }

                        res.json({
                            status: 1,
                            msg: "insert data tour successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 2,
                            msg: "insert data tour failed"
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

exports.getToursAgent = async (req, res) => {
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_getToursAgent = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_getToursAgent = `SELECT @n := @n + 1 no, id_data_tour, tour_name, id_status_approve, last_insert_tour FROM tb_data_tours, (SELECT @n := 0) m`;
                }
                else {
                    sql_getToursAgent = `SELECT @n := @n + 1 no, id_data_tour, tour_name, id_status_approve, last_insert_tour FROM tb_data_tours, (SELECT @n := 0) m WHERE id_account = ${v_token.data_user.id_account}`;
                }
                const r_getToursAgent = await querySQL(sql_getToursAgent);
                if (r_getToursAgent) {
                    res.json({
                        status: 1,
                        msg: "get data tours successfully",
                        tours: r_getToursAgent
                    });
                }
                else {
                    res.json({
                        status: 2,
                        msg: "get data tours falied"
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

/* --------------------------------- End Agent ---------------------------------- */

/* ------------------------------------ Admin ----------------------------------- */



/* ---------------------------------- End Admin --------------------------------- */

exports.deleteTour = async (req, res) => {
    const id_data_tour = parseInt(req.body.id_data_tour);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getPreviewImg = `SELECT preview_img_name FROM tb_data_tours WHERE id_data_tour = ${id_data_tour}`;
                const r_getPreviweImg = await querySQL(sql_getPreviewImg);
                if (r_getPreviweImg) {
                    deleteFileTour(r_getPreviweImg[0].preview_img_name);
                }

                const sql_getPhoto = `SELECT name_img_data_tour FROM tb_img_data_tour WHERE id_data_tour = ${id_data_tour}`;
                const r_getPhoto = await querySQL(sql_getPhoto);
                if (r_getPhoto) {
                    for (let i = 0; i < r_getPhoto.length; i++) {
                        deleteFileTour(r_getPhoto[i].name_img_data_tour);
                    }
                }

                const sql_getPhotoMP1 = `SELECT name_img_data_tour_meeting_p_1 FROM tb_img_data_tours_meeting_p_1 WHERE id_data_tour = ${id_data_tour}`;
                const r_getPhotoMP1 = await querySQL(sql_getPhotoMP1);
                if (r_getPhotoMP1) {
                    for (let i = 0; i < r_getPhotoMP1.length; i++) {
                        deleteFileTour(r_getPhotoMP1[i].name_img_data_tour_meeting_p_1);
                    }
                }

                const sql_getPhotoMP2 = `SELECT name_img_data_tour_meeting_p_2 FROM tb_img_data_tours_meeting_p_2 WHERE id_data_tour = ${id_data_tour}`;
                const r_getPhotoMP2 = await querySQL(sql_getPhotoMP2);
                if (r_getPhotoMP2) {
                    for (let i = 0; i < r_getPhotoMP2.length; i++) {
                        deleteFileTour(r_getPhotoMP2[i].name_img_data_tour_meeting_p_2);
                    }
                }
                const sql_deleteTour = `DELETE FROM tb_data_tours WHERE id_data_tour = ${id_data_tour}`;
                const r_deleteTour = await querySQL(sql_deleteTour);
                if (r_deleteTour) {
                    res.json({
                        status: 1,
                        msg: "delete tour successfully"
                    });
                }
                else {
                    res.json({
                        status: 2,
                        msg: "delete tour failed"
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

exports.getDataTourEdit = async (req, res) => {
    const id_data_tour = req.params.id_data_tour;
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_getDataTour = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_getDataTour = `SELECT tour_name, tour_address, tour_contact_number, type, star, tour_email, preview_img_name, alt_preview_img, title_preview_img, description_preview_img, meeting_p_1, detail_meeting_p_1, meeting_p_2, detail_meeting_p_2, highlight, content, includes, excludes, you_need_to_know, how_to_travel, cancellation_policy FROM tb_data_tours WHERE id_data_tour = ${id_data_tour}`;
                }
                else {
                    sql_getDataTour = `SELECT tour_name, tour_address, tour_contact_number, type, star, tour_email, preview_img_name, alt_preview_img, title_preview_img, description_preview_img, meeting_p_1, detail_meeting_p_1, meeting_p_2, detail_meeting_p_2, highlight, content, includes, excludes, you_need_to_know, how_to_travel, cancellation_policy FROM tb_data_tours WHERE id_data_tour = ${id_data_tour} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_getDataTour = await querySQL(sql_getDataTour);
                if (r_getDataTour) {
                    const sql_getImg = `SELECT id_img_data_tour, name_img_data_tour, title_img_data_tour, alt_img_data_tour, description_img_data_tour FROM tb_img_data_tour WHERE id_data_tour = ${id_data_tour}`;
                    const r_getImg = await querySQL(sql_getImg);

                    const sql_getImgMP1 = `SELECT id_img_data_tour_meeting_p_1, name_img_data_tour_meeting_p_1, title_img_data_tour_meeting_p_1, alt_img_data_tour_meeting_p_1, description_img_data_tour_meeting_p_1 FROM tb_img_data_tours_meeting_p_1 WHERE id_data_tour = ${id_data_tour}`;
                    const r_getImgMP1 = await querySQL(sql_getImgMP1);

                    const sql_getImgMP2 = `SELECT id_img_data_tour_meeting_p_2, name_img_data_tour_meeting_p_2, title_img_data_tour_meeting_p_2, alt_img_data_tour_meeting_p_2, description_img_data_tour_meeting_p_2 FROM tb_img_data_tours_meeting_p_2 WHERE id_data_tour = ${id_data_tour}`;
                    const r_getImgMP2 = await querySQL(sql_getImgMP2);

                    res.json({
                        status: 1,
                        dataTour: r_getDataTour,
                        dataImg: r_getImg,
                        dataImgMP1: r_getImgMP1,
                        dataImgMP2: r_getImgMP2
                    });
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get data tour failed"
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

exports.editPrevireImg = async (req, res) => {
    const id_data_tour = req.body.id_data_tour;
    const previewImage = req.files.previewImage[0].filename;
    const altPreviewImg = escapeOutput(req.body.altPreviewImg);
    const titlePreviewImg = escapeOutput(req.body.titlePreviewImg);
    const desPreviewImg = escapeOutput(req.body.desPreviewImg);
    const checkImagePreview = req.body.checkImagePreview;

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                if (checkImagePreview) {
                    const sql_getPreviewBefore = `SELECT preview_img_name FROM tb_data_tours WHERE id_data_tour = ${id_data_tour}`
                    const r_getPreviweImg = await querySQL(sql_getPreviewBefore);

                    let sql_updatePreview = '';
                    if (r_getPreviweImg) {
                        sql_updatePreview = `UPDATE tb_data_tours SET preview_img_name = '${previewImage}', alt_preview_img = '${altPreviewImg}', title_preview_img = '${titlePreviewImg}', description_preview_img = '${desPreviewImg}' WHERE id_data_tour = ${id_data_tour}`;
                        deleteFileTour(r_getPreviweImg[0].preview_img_name);
                    }
                    else {
                        sql_updatePreview = `UPDATE tb_data_tours SET alt_preview_img = '${altPreviewImg}', title_preview_img = '${titlePreviewImg}', description_preview_img = '${desPreviewImg}' WHERE id_data_tour = ${id_data_tour}`;
                    }

                    const r_updatePreview = await querySQL(sql_updatePreview);
                    if (r_updatePreview) {
                        res.json({
                            status: 1,
                            msg: "Update preview image successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "Update preview image failed"
                        });
                    }
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

exports.editPhoto = async (req, res) => {
    const idPhotoEdit = parseInt(req.body.idPhotoEdit);
    const altPhoto = escapeOutput(req.body.altPhoto);
    const titlePhoto = escapeOutput(req.body.titlePhoto);
    const descriptionPhoto = escapeOutput(req.body.descriptionPhoto);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                if (req.files.photos) {
                    const sql_getPhotoDel = `SELECT name_img_data_tour FROM tb_img_data_tour WHERE id_img_data_tour = ${idPhotoEdit}`;
                    const r_getPhotoDel = await querySQL(sql_getPhotoDel);
                    if (r_getPhotoDel) {
                        deleteFileTour(r_getPhotoDel[0].name_img_data_tour);
                        const sql_updatePhoto = `UPDATE tb_img_data_tour SET name_img_data_tour = '${req.files.photos[0].filename}', title_img_data_tour = '${titlePhoto}', alt_img_data_tour = '${altPhoto}', description_img_data_tour = '${descriptionPhoto}' WHERE id_img_data_tour = ${idPhotoEdit}`;
                        const r_updatePhoto = await querySQL(sql_updatePhoto);
                        if (r_updatePhoto) {
                            res.json({
                                status: 1,
                                msg: "Update photo successfully"
                            });
                        }
                        else {
                            res.json({
                                status: 0,
                                msg: "Update photo failed"
                            });
                        }
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "get name image falied"
                        });
                    }
                }
                else {
                    const sql_updatePhoto = `UPDATE tb_img_data_tour SET title_img_data_tour = '${titlePhoto}', alt_img_data_tour = '${altPhoto}', description_img_data_tour = '${descriptionPhoto}' WHERE id_img_data_tour = ${idPhotoEdit}`;
                    const r_updatePhoto = await querySQL(sql_updatePhoto);
                    if (r_updatePhoto) {
                        res.json({
                            status: 1,
                            msg: "Update photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "Update photo failed"
                        });
                    }
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

exports.deletePhoto = async (req, res) => {
    const idPhotoDel = parseInt(req.body.idPhotoDel);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getPhotoBefore = `SELECT name_img_data_tour FROM tb_img_data_tour WHERE id_img_data_tour = ${idPhotoDel}`;
                const r_getPhotoBefore = await querySQL(sql_getPhotoBefore);
                if (r_getPhotoBefore) {
                    deleteFileTour(r_getPhotoBefore[0].name_img_data_tour);
                    const sql_deletePhoto = `DELETE FROM tb_img_data_tour WHERE id_img_data_tour = ${idPhotoDel}`;
                    const r_deletePhoto = querySQL(sql_deletePhoto);
                    if (r_deletePhoto) {
                        res.json({
                            status: 1,
                            msg : "delete image successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete image failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name image delete failed"
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

exports.deletePhotoAll = async (req, res) => {
    const idDataTour = parseInt(req.body.idDataTour);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getAllPhoto = `SELECT name_img_data_tour FROM tb_img_data_tour WHERE id_data_tour = ${idDataTour}`;
                const r_getAllPhoto = await querySQL(sql_getAllPhoto);
                if (r_getAllPhoto) {
                    for(let i = 0; i < r_getAllPhoto.length; i++) {
                        deleteFileTour(r_getAllPhoto[i].name_img_data_tour);
                    }

                    const sql_deletePhotoAll = `DELETE FROM tb_img_data_tour WHERE id_data_tour = ${idDataTour}`;
                    const r_deletePhotoAll = await querySQL(sql_deletePhotoAll);
                    if (r_deletePhotoAll) {
                        res.json({
                            status: 1,
                            msg: "delete all photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete all photo failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name photo all failed"
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

exports.deletePhotoAllMP1 = async (req, res) => {
    const idDataTour = parseInt(req.body.idDataTour);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getAllPhotoMP1 = `SELECT name_img_data_tour_meeting_p_1 FROM tb_img_data_tours_meeting_p_1 WHERE id_data_tour = ${idDataTour}`;
                const r_getAllPhotoMP1 = await querySQL(sql_getAllPhotoMP1);
                if (r_getAllPhotoMP1) {
                    for(let i = 0; i < r_getAllPhotoMP1.length; i++) {
                        deleteFileTour(r_getAllPhotoMP1[i].name_img_data_tour_meeting_p_1);
                    }

                    const sql_deletePhotoAllMP1 = `DELETE FROM tb_img_data_tours_meeting_p_1 WHERE id_data_tour = ${idDataTour}`;
                    const r_deletePhotoAllMP1 = await querySQL(sql_deletePhotoAllMP1);
                    if (r_deletePhotoAllMP1) {
                        res.json({
                            status: 1,
                            msg: "delete all photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete all photo failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name photo all failed"
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

exports.editPhotoMP1 = async (req, res) => {
    const idPhotoEdit = parseInt(req.body.idPhotoEdit);
    const altPhotoMP1 = escapeOutput(req.body.altPhotoMP1);
    const titlePhotoMP1 = escapeOutput(req.body.titlePhotoMP1);
    const descriptionPhotoMP1 = escapeOutput(req.body.descriptionPhotoMP1);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                if (req.files.photosMP1) {
                    const sql_getPhotoDel = `SELECT name_img_data_tour_meeting_p_1 FROM tb_img_data_tours_meeting_p_1 WHERE id_img_data_tour_meeting_p_1 = ${idPhotoEdit}`;
                    const r_getPhotoDel = await querySQL(sql_getPhotoDel);
                    if (r_getPhotoDel) {
                        deleteFileTour(r_getPhotoDel[0].name_img_data_tour_meeting_p_1);
                        const sql_updatePhotoMP1 = `UPDATE tb_img_data_tours_meeting_p_1 SET name_img_data_tour_meeting_p_1 = '${req.files.photosMP1[0].filename}', title_img_data_tour_meeting_p_1 = '${titlePhotoMP1}', alt_img_data_tour_meeting_p_1 = '${altPhotoMP1}', description_img_data_tour_meeting_p_1 = '${descriptionPhotoMP1}' WHERE id_img_data_tour_meeting_p_1 = ${idPhotoEdit}`;
                        const r_updatePhotoMP1 = await querySQL(sql_updatePhotoMP1);
                        if (r_updatePhotoMP1) {
                            res.json({
                                status: 1,
                                msg: "Update photo successfully"
                            });
                        }
                        else {
                            res.json({
                                status: 0,
                                msg: "Update photo failed"
                            });
                        }
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "get name image falied"
                        });
                    }
                }
                else {
                    const sql_updatePhotoMP1 = `UPDATE tb_img_data_tours_meeting_p_1 SET title_img_data_tour_meeting_p_1 = '${titlePhotoMP1}', alt_img_data_tour_meeting_p_1 = '${altPhotoMP1}', description_img_data_tour_meeting_p_1 = '${descriptionPhotoMP1}' WHERE id_img_data_tour_meeting_p_1 = ${idPhotoEdit}`;
                    const r_updatePhotoMP1 = await querySQL(sql_updatePhotoMP1);
                    if (r_updatePhotoMP1) {
                        res.json({
                            status: 1,
                            msg: "Update photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "Update photo failed"
                        });
                    }
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

exports.deletePhotoMP1 = async (req, res) => {
    const idPhotoDel = parseInt(req.body.idPhotoDel);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getPhotoBeforeMP1 = `SELECT name_img_data_tour_meeting_p_1 FROM tb_img_data_tours_meeting_p_1 WHERE id_img_data_tour_meeting_p_1 = ${idPhotoDel}`;
                const r_getPhotoBeforeMP1 = await querySQL(sql_getPhotoBeforeMP1);
                if (r_getPhotoBeforeMP1) {
                    deleteFileTour(r_getPhotoBeforeMP1[0].name_img_data_tour_meeting_p_1);
                    const sql_deletePhotoMP1 = `DELETE FROM tb_img_data_tours_meeting_p_1 WHERE id_img_data_tour_meeting_p_1 = ${idPhotoDel}`;
                    const r_deletePhotoMP1 = querySQL(sql_deletePhotoMP1);
                    if (r_deletePhotoMP1) {
                        res.json({
                            status: 1,
                            msg : "delete image successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete image failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name image delete failed"
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

exports.deletePhotoAllMP2 = async (req, res) => {
    const idDataTour = parseInt(req.body.idDataTour);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getAllPhotoMP2 = `SELECT name_img_data_tour_meeting_p_2 FROM tb_img_data_tours_meeting_p_2 WHERE id_data_tour = ${idDataTour}`;
                const r_getAllPhotoMP2 = await querySQL(sql_getAllPhotoMP2);
                if (r_getAllPhotoMP2) {
                    for(let i = 0; i < r_getAllPhotoMP2.length; i++) {
                        deleteFileTour(r_getAllPhotoMP2[i].name_img_data_tour_meeting_p_2);
                    }

                    const sql_deletePhotoAllMP2 = `DELETE FROM tb_img_data_tours_meeting_p_2 WHERE id_data_tour = ${idDataTour}`;
                    const r_deletePhotoAllMP2 = await querySQL(sql_deletePhotoAllMP2);
                    if (r_deletePhotoAllMP2) {
                        res.json({
                            status: 1,
                            msg: "delete all photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete all photo failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name photo all failed"
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

exports.deletePhotoMP2 = async (req, res) => {
    const idPhotoDel = parseInt(req.body.idPhotoDel);
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                const sql_getPhotoBeforeMP2 = `SELECT name_img_data_tour_meeting_p_2 FROM tb_img_data_tours_meeting_p_2 WHERE id_img_data_tour_meeting_p_2 = ${idPhotoDel}`;
                const r_getPhotoBeforeMP2 = await querySQL(sql_getPhotoBeforeMP2);
                if (r_getPhotoBeforeMP2) {
                    deleteFileTour(r_getPhotoBeforeMP2[0].name_img_data_tour_meeting_p_2);
                    const sql_deletePhotoMP2 = `DELETE FROM tb_img_data_tours_meeting_p_2 WHERE id_img_data_tour_meeting_p_2 = ${idPhotoDel}`;
                    const r_deletePhotoMP2 = querySQL(sql_deletePhotoMP2);
                    if (r_deletePhotoMP2) {
                        res.json({
                            status: 1,
                            msg : "delete image successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "delete image failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "get name image delete failed"
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

exports.editPhotoMP2 = async (req, res) => {
    const idPhotoEdit = parseInt(req.body.idPhotoEdit);
    const altPhotoMP2 = escapeOutput(req.body.altPhotoMP2);
    const titlePhotoMP2 = escapeOutput(req.body.titlePhotoMP2);
    const descriptionPhotoMP2 = escapeOutput(req.body.descriptionPhotoMP2);

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                if (req.files.photosMP2) {
                    const sql_getPhotoDel = `SELECT name_img_data_tour_meeting_p_2 FROM tb_img_data_tours_meeting_p_2 WHERE id_img_data_tour_meeting_p_2 = ${idPhotoEdit}`;
                    const r_getPhotoDel = await querySQL(sql_getPhotoDel);
                    if (r_getPhotoDel) {
                        deleteFileTour(r_getPhotoDel[0].name_img_data_tour_meeting_p_2);
                        const sql_updatePhotoMP2 = `UPDATE tb_img_data_tours_meeting_p_2 SET name_img_data_tour_meeting_p_2 = '${req.files.photosMP2[0].filename}', title_img_data_tour_meeting_p_2 = '${titlePhotoMP2}', alt_img_data_tour_meeting_p_2 = '${altPhotoMP2}', description_img_data_tour_meeting_p_2 = '${descriptionPhotoMP2}' WHERE id_img_data_tour_meeting_p_2 = ${idPhotoEdit}`;
                        const r_updatePhotoMP2 = await querySQL(sql_updatePhotoMP2);
                        if (r_updatePhotoMP2) {
                            res.json({
                                status: 1,
                                msg: "Update photo successfully"
                            });
                        }
                        else {
                            res.json({
                                status: 0,
                                msg: "Update photo failed"
                            });
                        }
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "get name image falied"
                        });
                    }
                }
                else {
                    const sql_updatePhotoMP2 = `UPDATE tb_img_data_tours_meeting_p_2 SET title_img_data_tour_meeting_p_2 = '${titlePhotoMP2}', alt_img_data_tour_meeting_p_2 = '${altPhotoMP2}', description_img_data_tour_meeting_p_2 = '${descriptionPhotoMP2}' WHERE id_img_data_tour_meeting_p_2 = ${idPhotoEdit}`;
                    const r_updatePhotoMP2 = await querySQL(sql_updatePhotoMP2);
                    if (r_updatePhotoMP2) {
                        res.json({
                            status: 1,
                            msg: "Update photo successfully"
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "Update photo failed"
                        });
                    }
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

exports.updateTour = async (req, res) => {
    const idDataTour = parseInt(req.body.idDataTour);
    const tourName = escapeOutput(req.body.tourName);
    const address = escapeOutput(req.body.address);
    const contact = escapeOutput(req.body.contact);
    const type = escapeOutput(req.body.type);
    const star = escapeOutput(req.body.star);
    const email = escapeOutput(req.body.email);
    const destinationMP1 = escapeOutput(req.body.destinationMP1);
    const detailMP1 = escapeOutput(req.body.detailMP1);
    const destinationMP2 = escapeOutput(req.body.destinationMP2);
    const detailMP2 = escapeOutput(req.body.detailMP2);
    const highlight = req.body.highlight;
    const content = req.body.content;
    const includes = req.body.includes;
    const excludes = req.body.excludes;
    const youNeedToKnow = req.body.youNeedToKnow;
    const howToTravel = req.body.howToTravel;
    const cancellationPolicy = req.body.cancellationPolicy;

    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_updateTour = '';
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_updateTour = `UPDATE tb_data_tours SET tour_name = '${tourName}', tour_address = '${address}', tour_contact_number = '${contact}', type = '${type}', star = '${star}', tour_email = '${email}', meeting_p_1 = '${destinationMP1}', detail_meeting_p_1 = '${detailMP1}', meeting_p_2 = '${destinationMP2}', detail_meeting_p_2 = '${detailMP2}', highlight = '${highlight}', content = '${content}', includes = '${includes}', excludes = '${excludes}', you_need_to_know = '${youNeedToKnow}', how_to_travel = '${howToTravel}', cancellation_policy = '${cancellationPolicy}' WHERE id_data_tour = ${idDataTour}`;
                }
                else {
                    sql_updateTour = `UPDATE tb_data_tours SET tour_name = '${tourName}', tour_address = '${address}', tour_contact_number = '${contact}', type = '${type}', star = '${star}', tour_email = '${email}', meeting_p_1 = '${destinationMP1}', detail_meeting_p_1 = '${detailMP1}', meeting_p_2 = '${destinationMP2}', detail_meeting_p_2 = '${detailMP2}', highlight = '${highlight}', content = '${content}', includes = '${includes}', excludes = '${excludes}', you_need_to_know = '${youNeedToKnow}', how_to_travel = '${howToTravel}', cancellation_policy = '${cancellationPolicy}' WHERE id_data_tour = ${idDataTour} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_updateTour = await querySQL(sql_updateTour);
                if (r_updateTour) {
                    if (req.files.photos) {
                        let sql_addPhoto = `INSERT INTO tb_img_data_tour (id_data_tour, name_img_data_tour) VALUES `;
                        for (let i = 1; i <= req.files.photos.length; i++) {
                            if (i !== req.files.photos.length) {
                                sql_addPhoto += `(${idDataTour}, '${req.files.photos[i-1].filename}'),`;
                            }
                            else {
                                sql_addPhoto += `(${idDataTour}, '${req.files.photos[i-1].filename}')`;
                            }
                        }
                        const r_addPhoto = await querySQL(sql_addPhoto);
                    }

                    if (req.files.photosMP1) {
                        let sql_add_img_MP1 = `INSERT INTO tb_img_data_tours_meeting_p_1 (id_data_tour, name_img_data_tour_meeting_p_1) VALUES `;
                        for (let i = 1; i <= req.files.photosMP1.length; i++) {
                            if (i !== req.files.photosMP1.length) {
                                sql_add_img_MP1 += `(${idDataTour}, '${req.files.photosMP1[i-1].filename}'),`;
                            }
                            else {
                                sql_add_img_MP1 += `(${idDataTour}, '${req.files.photosMP1[i-1].filename}')`;
                            }
                        }
                        const r_add_img_MP1 = await querySQL(sql_add_img_MP1);
                    }

                    if (req.files.photosMP2) {
                        let sql_add_img_MP2 = `INSERT INTO tb_img_data_tours_meeting_p_2 (id_data_tour, name_img_data_tour_meeting_p_2) VALUES `;
                        for (let i = 1; i <= req.files.photosMP2.length; i++) {
                            if (i !== req.files.photosMP2.length) {
                                sql_add_img_MP2 += `(${idDataTour}, '${req.files.photosMP2[i-1].filename}'),`;
                            }
                            else {
                                sql_add_img_MP2 += `(${idDataTour}, '${req.files.photosMP2[i-1].filename}')`;
                            }
                        }
                        const r_add_img_MP2 = await querySQL(sql_add_img_MP2);
                    }

                    res.json({
                        status: 1,
                        msg: "Update data tour successfully"
                    });
                }
                else {
                    res.json({
                        status: 2,
                        msg: "Update data tour failed"
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

exports.updateStatusTour = async (req, res) => {
    const id_data_tour = parseInt(req.body.id_data_tour);
    const id_status_approve = parseInt(req.body.id_status_approve);
    
    try {
        const v_token = await verifyJWT(req.token);
        if (v_token) {
            if (v_token.data_user.id_status_member === 1 || v_token.data_user.id_status_member === 1729384732) {
                let sql_updateApproveTour = ``;
                if (v_token.data_user.id_status_member === 1729384732) {
                    sql_updateApproveTour = `UPDATE tb_data_tours SET id_status_approve = ${id_status_approve} WHERE id_data_tour = ${id_data_tour}`;
                }
                else {
                    sql_updateApproveTour = `UPDATE tb_data_tours SET id_status_approve = ${id_status_approve} WHERE id_data_tour = ${id_data_tour} AND id_account = ${v_token.data_user.id_account}`;
                }
                const r_updateApproveTour = await querySQL(sql_updateApproveTour);
                if (r_updateApproveTour) {
                    const sql_getEmail = `SELECT email_member FROM tb_members WHERE id_account = ${v_token.data_user.id_account}`;
                    const r_getEmail = await querySQL(sql_getEmail);
                    if (r_getEmail) {
                        let mailOptions = '';
                        if(id_status_approve === 1) {
                            mailOptions = {
                                from: 'nodemailerTour@gmail.com',
                                to: r_getEmail[0].email_member,
                                subject: 'Hello from Tour Management',
                                html: '<b>Your Tour is approved.</b>'
                            };
                        }
                        else {
                            mailOptions = {
                                from: 'nodemailerTour@gmail.com',
                                to: r_getEmail[0].email_member,
                                subject: 'Hello from Tour Management',
                                html: '<b>Your Tour is Waiting.</b>'
                            };
                        }
                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err) {
                                res.json({
                                    status: 0,
                                    msg: err
                                });
                            }
                            else {
                                res.json({
                                    status: 1,
                                    msg: "update status tour successfully"
                                });
                            }
                        });
                    }
                    else {
                        res.json({
                            status: 0,
                            msg: "Get Email failed"
                        });
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: "Update status tour failed"
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
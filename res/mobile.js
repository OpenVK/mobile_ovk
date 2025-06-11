$(document).on('click', '.show_more_info_profile_link', (e) => {
    $('.show_more_info_profile_content').toggleClass('active')
    $('.show_more_info_profile_link').html([tr('mobile_user_info_show_details'), tr('mobile_user_info_hide')][Number($('.show_more_info_profile_content').hasClass('active'))])
})

u(document).on("click", ".post-like-button-natural", function(e) {
    e.preventDefault();
    
    const thisBtn = u(e.target).closest('a');
    const link    = thisBtn.attr("href");
    const heart   = thisBtn.find('.like');
    const counter = thisBtn.find('.likeCnt');
    const likes   = counter.text() === "" ? 0 : counter.text();
    const isLiked = Number(thisBtn.attr("data-liked")) == 1;

    fetch(link, {
        method: 'POST'
    })

    thisBtn.attr("data-liked", !isLiked ? '1' : '0')

    if(!isLiked) {
        heart.attr("id", 'liked');
    } else {
        heart.attr("id", '');
    }
    
    counter.text(parseInt(likes) + (isLiked ? -1 : 1));
    if (counter.text() === "0") {
        counter.text("");
    }
    
    return false;
})

u(document).on('click', '#search_options_toggler', (e) => {
    u('.search_options').toggleClass('hidden')
    u('#search_options_toggler_arrow').toggleClass('shown')
})

u(document).on('click', '#__mobile_reset_search', (e) => {
    u('.main .header_search_inputbt .sr_input').nodes[0].value = ''
    u(`.page_search_options input[type='text']`).nodes.forEach(inp => {
        inp.value = ''
    })

    u(`.page_search_options input[type='checkbox']`).nodes.forEach(chk => {
        chk.checked = false
    })

    u(`.page_search_options input[type='radio']`).nodes.forEach(rad => {
        if(rad.dataset.default) {
            rad.checked = true
            return
        }

        rad.checked = false
    })

    u(`.page_search_options select`).nodes.forEach(sel => {
        sel.value = sel.dataset.default
    })
})

u(document).on("input", "textarea", function(e) {
    var boost             = 5;
    var textArea          = e.target;
    textArea.style.height = "5px";
    var newHeight = textArea.scrollHeight;
    textArea.style.height = newHeight + boost + "px";
    return;
})

u(document).on('click', '#__delete_warn', (e) => {
    e.preventDefault()

    const msg = new CMessageBox({
        title: tr("confirm"),
        body: tr("question_confirm"),
        buttons: [tr('yes'), tr('no')],
        callbacks: [() => {
            location.assign(e.target.href)
            msg.close()
        }, Function.noop]
    })
})

u(document).on('click', '.post.post-nsfw .post-content', (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if(window.openvk.current_id == 0) {
        return
    }
    
    u(e.target).closest('.post-nsfw').removeClass('post-nsfw')
})

u(document).on('click', '#_bl_toggler', async (e) => {
    e.preventDefault()

    const target = u(e.target)
    const val = Number(target.attr('data-val'))
    const id  = Number(target.attr('data-id'))
    const name = target.attr('data-name')

    const fallback = (e) => {
        fastError(e.message)
        target.removeClass('lagged')
    }

    if(val == 1) {
        const msg = new CMessageBox({
            title: tr('addition_to_bl'),
            body: `<span>${escapeHtml(tr('adding_to_bl_sure', name))}</span>`,
            buttons: [tr('yes'), tr('no')],
            callbacks: [async () => {
                try {
                    target.addClass('lagged')
                    await window.OVKAPI.call('account.ban', {'owner_id': id})
                    location.assign(location.href)
                } catch(e) {
                    fallback(e)
                }
            }, () => Function.noop]
        })
    } else {
        try {
            target.addClass('lagged')
            await window.OVKAPI.call('account.unban', {'owner_id': id})
            location.assign(location.href)
        } catch(e) {
            fallback(e)
        }
    }
})

u(document).on("click", "#__ignoreSomeone", async (e) => {
    e.preventDefault()

    const TARGET = u(e.target)
    const ENTITY_ID = Number(e.target.dataset.id)
    const VAL = Number(e.target.dataset.val)
    const ACT = VAL == 1 ? 'ignore' : 'unignore'
    const METHOD_NAME = ACT == 'ignore' ? 'addBan' : 'deleteBan'
    const PARAM_NAME = ENTITY_ID < 0 ? 'group_ids' : 'user_ids'
    const ENTITY_NAME = ENTITY_ID < 0 ? 'club' : 'user'
    const URL = `/method/newsfeed.${METHOD_NAME}?auth_mechanism=roaming&${PARAM_NAME}=${Math.abs(ENTITY_ID)}`
    
    TARGET.addClass('lagged')
    const REQ = await fetch(URL)
    const RES = await REQ.json()
    TARGET.removeClass('lagged')

    if(RES.error_code) {
        switch(RES.error_code) {
            case -10:
                fastError(';/')
                break
            case -50:
                fastError(tr('ignored_sources_limit'))
                break
            default:
                fastError(res.error_msg)
                break
        }
        return
    }

    if(RES.response == 1) {
        if(ACT == 'unignore') {
            TARGET.attr('data-val', '1')
            TARGET.html(tr(`ignore_${ENTITY_NAME}`))
        } else {
            TARGET.attr('data-val', '0')
            TARGET.html(tr(`unignore_${ENTITY_NAME}`))
        }
    }
})

u(document).on('click', '#write .attach_button', (e) => {
    const button = u(e.target).closest('a')
    const type   = button.attr('data-type')
    const form   = u(e.target).closest('#write')

    console.log(type)
    if(type == "photo") {
        form.find('#_pic_attachment').nodes[0].click()
    }
})

u(document).on('change', '#_pic_attachment', (e) => {
    for(file of e.target.files) {
        __uploadToTextarea(file, u(e.target).closest('#write'))
    }
})

// TODO: Move to separate files and load at full version and in mobile. code reusing короче

u(document).on('click', `.post-horizontal .upload-item .upload-delete`, (e) => {
    e.preventDefault()
    u(e.target).closest('.upload-item').remove()
})

u(document).on('click', `.vertical-attachment #small_remove_button`, (e) => {
    e.preventDefault()
    u(e.target).closest('.vertical-attachment').remove()
})

u(document).on('click', '.post-buttons .upload-item', (e) => {
    e.preventDefault()
    e.stopPropagation()
})

async function __uploadToTextarea(file, textareaNode) {
    const MAX_FILESIZE = window.openvk.max_filesize_mb*1024*1024
    let filetype = 'photo'
    if(file.type.startsWith('video/')) {
        filetype = 'video'
    }

    if(!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        fastError(tr("only_images_accepted", escapeHtml(file.name)))
        throw new Error('Only images accepted')
    }

    if(file.size > MAX_FILESIZE) {
        fastError(tr("max_filesize", window.openvk.max_filesize_mb))
        throw new Error('Big file')
    }

    const horizontal_count = textareaNode.find('.post-horizontal > a').length
    if(horizontal_count > window.openvk.max_attachments) {
        fastError(tr("too_many_photos"))
        throw new Error('Too many attachments')
    }

    const form_data = new FormData
    form_data.append('photo_0', file)
    form_data.append('count', 1)
    form_data.append("hash", u("meta[name=csrf]").attr("value"))
    
    if(filetype == 'photo') {
        const temp_url = URL.createObjectURL(file)
        const rand = random_int(0, 1000)
        textareaNode.find('.post-horizontal').append(`<a id='temp_filler${rand}' class="upload-item lagged"><img src='${temp_url}'></a>`)
        
        const res = await fetch(`/photos/upload`, {
            method: 'POST',
            body: form_data
        })
        const json_response = await res.json()
        if(!json_response.success) {
            u(`#temp_filler${rand}`).remove()
            fastError((tr("error_uploading_photo") + json_response.flash.message))
            return
        }

        json_response.photos.forEach(photo => {
            __appendToTextarea({
                'type': 'photo',
                'preview': photo.url,
                'id': photo.pretty_id,
                'fullsize_url': photo.link,
            }, textareaNode)
        })
        u(`#temp_filler${rand}`).remove()
        URL.revokeObjectURL(temp_url)
    } else {
        return
    }
}

async function __appendToTextarea(attachment_obj, textareaNode) {
    const form = textareaNode.find('.post-buttons')
    const indicator = textareaNode.find('.post-horizontal')

    if(attachment_obj.alignment == 'vertical') {
        textareaNode.find('.post-vertical').append(`
            <div class="vertical-attachment upload-item" draggable="true" data-type='${attachment_obj.type}' data-id="${attachment_obj.id}">
                <div class='vertical-attachment-content' draggable="false">
                    ${attachment_obj.html}
                </div>
                <div class='${attachment_obj.undeletable ? 'lagged' : ''} vertical-attachment-remove'>
                    <div id='small_remove_button'></div>
                </div>
            </div>
        `)

        return
    }
    
    indicator.append(`
        <a draggable="true" href='/${attachment_obj.type}${attachment_obj.id}' class="upload-item" data-type='${attachment_obj.type}' data-id="${attachment_obj.id}">
            <span class="upload-delete">×</span>
            ${attachment_obj.type == 'video' ? `<div class='play-button'><div class='play-button-ico'></div></div>` : ''}
            <img draggable="false" src="${attachment_obj.preview}" alt='...'>
        </a>      
    `)
}

u(document).on('paste', '#write .small-textarea', (e) => {
    if(e.clipboardData.files.length === 1) {
        __uploadToTextarea(e.clipboardData.files[0], u(e.target).closest('#write'))
        return;
    }
})

u(document).on('dragstart', '#write .post-horizontal .upload-item, .post-vertical .upload-item, .PE_audios .vertical-attachment', (e) => {
    //e.preventDefault()
    //console.log(e)
    u(e.target).closest('.upload-item').addClass('currently_dragging')
    return
})

u(document).on('dragover', '#write .post-horizontal .upload-item, .post-vertical .upload-item, .PE_audios .vertical-attachment', (e) => {
    e.preventDefault()

    const target = u(e.target).closest('.upload-item')
    const current = u('.upload-item.currently_dragging')

    if(current.length < 1) {
        return
    }

    if(target.nodes[0].dataset.id != current.nodes[0].dataset.id) {
        target.addClass('dragged')
    }
    
    return
})

u(document).on("dragover drop", async (e) => {
    e.preventDefault()
    return false;
})

u(document).on('dragleave dragend', '#write .post-horizontal .upload-item, .post-vertical .upload-item, .PE_audios .vertical-attachment', (e) => {
    //console.log(e)
    u(e.target).closest('.upload-item').removeClass('dragged')
    return
})

u(document).on("drop", '#write', function(e) {
    const current = u('.upload-item.currently_dragging')
    //console.log(e)
    if(e.dataTransfer.types.includes('Files')) {
        e.preventDefault()

        e.dataTransfer.dropEffect = 'move'
        __uploadToTextarea(e.dataTransfer.files[0], u(e.target).closest('#write'))
    } else if(e.dataTransfer.types.length < 1 || e.dataTransfer.types.includes('text/uri-list')) { 
        e.preventDefault()

        const target = u(e.target).closest('.upload-item')
        u('.dragged').removeClass('dragged')
        current.removeClass('currently_dragging')
        //console.log(target)
        if(!current.closest('.vertical-attachment').length < 1 && target.closest('.vertical-attachment').length < 1
         || current.closest('.vertical-attachment').length < 1 && !target.closest('.vertical-attachment').length < 1) {
            return
        }

        const first_html = target.nodes[0].outerHTML
        const second_html = current.nodes[0].outerHTML

        current.nodes[0].outerHTML = first_html
        target.nodes[0].outerHTML = second_html
    }
})

u(document).on('submit', 'form', async (e) => {
    if(e.defaultPrevented) {
        return
    }

    if(e.target.closest('#write')) {
        const target = u(e.target)
        collect_attachments_node(target)
    }
})

function showSupportFastAnswerDialog(answers) {
    let html = "";
    for(const [index, answer] of Object.entries(answers)) {
        html += `
            <div class="hover-box" onclick="supportFastAnswerDialogOnClick(fastAnswers[${index}])">
                ${answer.replace(/\n/g, "<br />")}
            </div>
        `;
    }

    MessageBox(tr("fast_answers"), html, [tr("close")], [
        Function.noop
    ]);
}

function supportFastAnswerDialogOnClick(answer) {
    u("body").removeClass("dimmed");
    u(".ovk-diag-cont").remove();

    const answerInput = document.querySelector("#answer_text");
    answerInput.value = answer;
    answerInput.focus();
}

function showProfileDeactivateDialog(hash) {
    MessageBox(tr("profile_deactivate"), `
        <div class="messagebox-content-header">
            ${tr("profile_deactivate_header")}
        </div>
        <form action="/settings/deactivate" method="post" id="profile_deactivate_dialog" style="margin-top: 30px">
            <h4>${tr("profile_deactivate_reason_header")}</h4>
            <table>
                <tbody>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_1" data-text="${tr("profile_deactivate_reason_1_text")}"></td>
                        <td><label for="deactivate_r_1">${tr("profile_deactivate_reason_1")}</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_2" data-text="${tr("profile_deactivate_reason_2_text")}"></td>
                        <td><label for="deactivate_r_2">${tr("profile_deactivate_reason_2")}</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_3" data-text="${tr("profile_deactivate_reason_3_text")}"></td>
                        <td><label for="deactivate_r_3">${tr("profile_deactivate_reason_3")}</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_4" data-text="${tr("profile_deactivate_reason_4_text")}"></td>
                        <td><label for="deactivate_r_4">${tr("profile_deactivate_reason_4")}</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_5" data-text="${tr("profile_deactivate_reason_5_text")}"></td>
                        <td><label for="deactivate_r_5">${tr("profile_deactivate_reason_5")}</label></td>
                    </tr>
                    <tr>
                        <td><input type="radio" name="deactivate_type" id="deactivate_r_6" data-text=""></td>
                        <td><label for="deactivate_r_6">${tr("profile_deactivate_reason_6")}</label></td>
                    </tr>
                </tbody>
            </table>
            <textarea name="deactivate_reason" id="deactivate_reason" placeholder="${tr("gift_your_message")}"></textarea><br>
            <input type="checkbox" name="deactivate_share" id="deactivate_share" checked>
            <label for="deactivate_share">${tr("share_with_friends")}</label>
            <input type="hidden" name="hash" value="${hash}" />
        </form>
    `, [tr("profile_deactivate_button"), tr("cancel")], [
        () => {
            $("#profile_deactivate_dialog").submit();
        },
        Function.noop
    ]);

    $('[id^="deactivate_r_"]').on("click", function () {
        $('#deactivate_reason').val($(this).data("text"));
    });
}


function showCoinsTransferDialog(coinsCount, hash) {
    MessageBox(tr("transfer_poins"), `
        <div class="messagebox-content-header">
            ${tr("points_transfer_dialog_header_1")}
            ${tr("points_transfer_dialog_header_2")} <b>${tr("points_amount", coinsCount)}</b>
        </div>
        <form action="/coins_transfer" method="post" id="coins_transfer_form" style="margin-top: 30px">
            <div class="formInput">
                <label>
                    ${tr("receiver_address")}:
                </label>
                <input type="text" name="receiver" style="width: 100%;" />
            </div>
            <div class="formInput">
                <label>
                    ${tr("coins_count")}:
                </label>
                <input type="text" name="value" style="width: 100%;" />
            </div>
            <div class="formInput">
                <label>
                    ${tr("message")}:
                </label>
                <textarea name="message" style="width: 100%;"></textarea>
            </div>
            <input type="hidden" name="hash" value="${hash}" />
        </form>
    `, [tr("transfer_poins_button"), tr("cancel")], [
        () => {
            document.querySelector("#coins_transfer_form").submit();
        },
        Function.noop
    ]);
}

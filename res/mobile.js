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

    thisBtn.attr("data-liked", isLiked ? '1' : '0')

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

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// maybe сделать скрипт с подобными функциями чтобы не приходилось копипастить?
function highlightText(searchText, container_selector, selectors = []) {
    const container = u(container_selector)
    const regexp = new RegExp(`(${searchText})`, 'gi')

    function highlightNode(node) {
        if(node.nodeType == 3) {
            let newNode = escapeHtml(node.nodeValue)
            newNode = newNode.replace(regexp, (match, ...args) => {
                return `<span class='highlight'>${escapeHtml(match)}</span>`
            })
            
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = newNode

            while(tempDiv.firstChild) {
                node.parentNode.insertBefore(tempDiv.firstChild, node)
            }
            node.parentNode.removeChild(node)
        } else if(node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'BR' && node.tagName !== 'STYLE') {
            Array.from(node.childNodes).forEach(highlightNode);
        }
    }

    selectors.forEach(selector => {
        elements = container.find(selector)
        if(!elements || elements.length < 1) return;

        elements.nodes.forEach(highlightNode)
    })
}

// from: http://www.robots.ox.ac.uk/~vedaldi/assets/hidebib.js
function hideallbibs()
{
    var el = document.getElementsByTagName("div") ;
    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "paper") {
            // First check for bibtex-container divs (new fancy style)
            var bibContainers = el[i].getElementsByClassName("bibtex-container");
            if (bibContainers.length > 0) {
                bibContainers[0].style.display = 'none';
                // Remove copy button if it exists
                var copyBtn = bibContainers[0].querySelector('.copy-btn');
                if (copyBtn) {
                    copyBtn.remove();
                }
            } else {
                // Fallback to old style direct pre tags
                var bib = el[i].getElementsByTagName("pre") ;
                if (bib.length > 0) {
                    bib [0] .style.display = 'none' ;
                }
            }
            
            // Also check for abstract-container divs
            var abstractContainers = el[i].getElementsByClassName("abstract-container");
            if (abstractContainers.length > 0) {
                abstractContainers[0].style.display = 'none';
                // Remove collapse button if it exists
                var collapseBtn = abstractContainers[0].querySelector('.collapse-btn');
                if (collapseBtn) {
                    collapseBtn.remove();
                }
            }
        }
    }
}

function togglebib(paperid)
{
    var paper = document.getElementById(paperid) ;
    
    // Check if this is an abstract (description) toggle
    if (paperid.includes('_description')) {
        var abstractContainers = paper.getElementsByClassName("abstract-container");
        if (abstractContainers.length > 0) {
            if (abstractContainers[0].style.display == 'none') {
                abstractContainers[0].style.display = 'block';
                // Add collapse button
                addCollapseButton(abstractContainers[0], paperid);
            } else {
                abstractContainers[0].style.display = 'none';
                // Remove collapse button
                var collapseBtn = abstractContainers[0].querySelector('.collapse-btn');
                if (collapseBtn) {
                    collapseBtn.remove();
                }
            }
        } else {
            // Fallback to old style direct pre tags for abstracts
            var bib = paper.getElementsByTagName('pre') ;
            if (bib.length > 0) {
                if (bib [0] .style.display == 'none') {
                    bib [0] .style.display = 'block' ;
                } else {
                    bib [0] .style.display = 'none' ;
                }
            }
        }
        return;
    }
    
    // Handle bibtex containers (existing functionality)
    var bibContainers = paper.getElementsByClassName("bibtex-container");
    if (bibContainers.length > 0) {
        if (bibContainers[0].style.display == 'none') {
            bibContainers[0].style.display = 'block';
            // Add copy button
            addCopyButton(bibContainers[0]);
        } else {
            bibContainers[0].style.display = 'none';
            // Remove copy button
            var copyBtn = bibContainers[0].querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.remove();
            }
        }
    } else {
        // Fallback to old style direct pre tags
        var bib = paper.getElementsByTagName('pre') ;
        if (bib.length > 0) {
            if (bib [0] .style.display == 'none') {
                bib [0] .style.display = 'block' ;
            } else {
                bib [0] .style.display = 'none' ;
            }
        }
    }
}

function addCopyButton(container) {
    // Check if copy button already exists
    if (container.querySelector('.copy-btn')) {
        return;
    }
    
    // Create copy button
    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.title = 'Copy BibTeX to clipboard';
    
    // Add click handler
    copyBtn.onclick = function(e) {
        e.preventDefault();
        var preElement = container.querySelector('pre');
        if (preElement) {
            // Use the Clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(preElement.textContent).then(function() {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(function() {
                        copyBtn.textContent = 'Copy';
                    }, 2000);
                }).catch(function() {
                    // Fallback to older method
                    fallbackCopy(preElement, copyBtn);
                });
            } else {
                // Fallback for older browsers or non-HTTPS
                fallbackCopy(preElement, copyBtn);
            }
        }
    };
    
    // Add button to container
    container.appendChild(copyBtn);
}

function addCollapseButton(container, paperid) {
    // Check if collapse button already exists
    if (container.querySelector('.collapse-btn')) {
        return;
    }
    
    // Create collapse button
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'collapse-btn';
    collapseBtn.textContent = 'Hide';
    collapseBtn.title = 'Hide abstract';
    
    // Add click handler
    collapseBtn.onclick = function(e) {
        e.preventDefault();
        togglebib(paperid);
    };
    
    // Add button to container
    container.appendChild(collapseBtn);
}

function fallbackCopy(preElement, copyBtn) {
    // Create temporary textarea
    var textArea = document.createElement('textarea');
    textArea.value = preElement.textContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    try {
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        if (successful) {
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = 'Copy';
            }, 2000);
        }
    } catch (err) {
        console.error('Copy failed:', err);
    } finally {
        document.body.removeChild(textArea);
    }
}
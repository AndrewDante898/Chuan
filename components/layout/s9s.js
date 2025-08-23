$.fn.isValid = function () {
    return this[0].checkValidity()
}

// Datatables default settings
if ($.fn.dataTable) {
    $.extend(true, $.fn.dataTable.defaults, {
        pageType: "full_numbers",
        scrollX: true,
        searching: false,
        processing: true,
        serverSide: true,
        pageLength: 25,
        ajax: {
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: function (d) {
                return JSON.stringify(d);
            }
        }
    });
}

const renderDatetime = typeof DataTable !== "undefined" ? DataTable.render.datetime('YYYY-MM-DD HH:mm:ss') : null
const renderDate = typeof DataTable !== "undefined" ? DataTable.render.datetime('YYYY-MM-DD') : null

const messageBox = (function () {
    const alert = function (msg, okFunc) {
        Swal.fire({
            html: '<div class="mt-3">' +
                '<lord-icon src="/assets/js/pages/plugins/tdrtiskw.json" trigger="loop" colors="primary:#f06548,secondary:#f7b84b" style="width:120px;height:120px"></lord-icon>' +
                '<div class="mt-4 pt-2 fs-15">' +
                '<h5>' + msg + '</h5>' +
                '</div>' +
                '</div>',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonClass: 'btn btn-primary w-xs mb-1',
            cancelButtonText: btnOkLabel,
            buttonsStyling: false,
            showCloseButton: true
        }).then(function () {
            if (okFunc) {
                okFunc()
            }
        })
    };

    const info = function (msg, okFunc) {
        Swal.fire({
            html: '<div class="mt-3">' +
                '<lord-icon src="/assets/js/pages/plugins/lupuorrc.json" trigger="loop" colors="primary:#0ab39c,secondary:#405189" style="width:120px;height:120px"></lord-icon>' +
                '<div class="mt-4 pt-2 fs-15">' +
                '<h5>' + msg + '</h5>' +
                '</div>' +
                '</div>',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonClass: 'btn btn-primary w-xs mb-1',
            cancelButtonText: btnOkLabel,
            buttonsStyling: false,
            showCloseButton: true
        }).then(function () {
            if (okFunc) {
                okFunc()
            }
        })
    };

    const confirmYesNoCancel = function (msg, yesFunc, noFunc, cancelFunc) {
        Swal.fire({
            title: msg,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: btnYesLabel,
            confirmButtonClass: 'btn btn-success w-xs me-2',
            cancelButtonClass: 'btn btn-danger w-xs',
            denyButtonClass: 'btn btn-info w-xs me-2',
            buttonsStyling: false,
            denyButtonText: btnNoLabel,
            showCloseButton: true
        }).then(function (result) {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                if (yesFunc) {
                    yesFunc()
                }
            } else if (result.isDenied) {
                if (noFunc) {
                    noFunc()
                }
            } else {
                if (cancelFunc) {
                    cancelFunc()
                }
            }
        })
    };

    const confirm = function (msg, yesFunc, noFunc) {
        Swal.fire({
            title: msg,
            text: "",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: btnCancelLabel,
            confirmButtonClass: 'btn btn-primary w-xs me-2 mt-2',
            cancelButtonClass: 'btn btn-danger w-xs mt-2',
            confirmButtonText: btnConfirmLabel,
            buttonsStyling: false,
            showCloseButton: true
        }).then(function (result) {
            if (result.value) {
                if (yesFunc) {
                    yesFunc()
                }
            } else if (noFunc) {
                noFunc()
            }
        });
    };

    const showProcessMessage = function (msg) {
        const _msg = msg ? msg : processingMsg
        Swal.fire({
            title: _msg,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            onOpen: () => {
                swal.showLoading();
            }
        });
    }

    const hideProcessMessage = function () {
        swal.close()
    }

    return {
        alert: alert,
        info: info,
        confirmYesNoCancel: confirmYesNoCancel,
        confirm: confirm,
        showProcessMessage: showProcessMessage,
        hideProcessMessage: hideProcessMessage
    }
}());

const ajaxRespUtil = (function () {
    const processResult = function (result, successFunc, failFunc) {
        // maybe login session expired.
        if (typeof result === 'string') {
            window.location.reload()
            return
        }

        if (result.code === 200) {
            if (successFunc) {
                successFunc()
            }
        } else if (failFunc) {
            failFunc()
        }
    }

    const processError = function (error, handlerFunc) {
        let message = ''

        if (error.responseJSON) {
            if (error.responseJSON.violations) {
                const violations = error.responseJSON.violations

                violations.forEach(function (violation) {
                    message += violation.message + '</br>'
                });
            } else if (error.responseJSON.detail) {
                message = error.responseJSON.detail
            } else if (error.responseJSON.title) {
                message = error.responseJSON.title
            }
        }

        if (message === '') {
            message = 'Invalid transaction. Please try again later!'
        }
        messageBox.alert(message, handlerFunc)
    }

    return {
        processResult: processResult,
        processError: processError
    }
}());

// Numeric only control handler
$.fn.forceNumericOnly = function (allowDecimal) {
    allowDecimal = allowDecimal === undefined || allowDecimal === null ? true : allowDecimal

    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key === 8 ||
                key === 9 ||
                key === 13 ||
                key === 46 ||
                key === 110 ||
                (allowDecimal && key === 190) || // dot (.)
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

// may different depend on web layout
const showMenu = function (menuId) {
    const menu = $('#menu_' + menuId)
    if (menu.length) {
        menu.addClass('active')
        menu.parents('.collapse.menu-dropdown').addClass('show')
    }
}

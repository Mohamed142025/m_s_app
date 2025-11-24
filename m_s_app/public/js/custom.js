if (frappe.ui && frappe.ui.Page && !frappe.ui.Page.prototype._custom_patched) {
    frappe.ui.Page.prototype._custom_patched = true;

    const original_add_main_section = frappe.ui.Page.prototype.add_main_section;

    frappe.ui.Page.prototype.add_main_section = function () {
        // console.log(frappe.get_route())
        const route = frappe.get_route();
        if (route[0] === "List" || (route[0] === "Form" && route[1] === "Customize Form") || (route[0] === "Form" && route[1] === "DocType")) {
            // console.log("🚫 داخل List View - تجاهل التعديل");
            return original_add_main_section.call(this);
        }

        $(frappe.render_template("page", {})).appendTo(this.wrapper);

        if (this.single_column) {
            this.add_view(
                "main",
                '<div class="row layout-main">\
                    <div class="col-md-12 layout-main-section-wrapper">\
                        <div class="layout-main-section"></div>\
                        <div class="layout-footer hide"></div>\
                    </div>\
                </div>'
            );
        } else {
            this.add_view(
                "main",
                `
                <div class="row layout-main">
                    <div class="col-lg-2 layout-side-section custom-class"></div>
                    <div class="col layout-main-section-wrapper">
                        <div class="layout-main-section"></div>
                        <div class="layout-footer hide"></div>
                    </div>
                </div>
            `
            );
        }

        this.setup_page();

        const moveCustomActions = () => {
            const customActions = $(this.wrapper).find('.custom-actions');
            if (customActions.length) {
                const $wrapper = $(`<div class="my-custom-wrapper" style="position: relative;"></div>`);
                const $extraDiv = $(`<div class="my-extra-div" style="position: sticky; top: 129px"></div>`);
                customActions.appendTo($extraDiv);
                $wrapper.append($extraDiv);
                $(this.wrapper).find('.layout-main').first().append($wrapper);
                console.log("✅ Wrapped .custom-actions in custom container");
            } else {
                setTimeout(moveCustomActions, 100);
            }
        };

        moveCustomActions();
    };

    // console.log("🔧 Patched frappe.ui.Page.add_main_section()");
}

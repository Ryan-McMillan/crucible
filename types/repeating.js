"use strict";

var m      = require("mithril"),
    assign = require("lodash.assign"),
    times  = require("lodash.times"),
    
    children     = require("./children"),
    instructions = require("./instructions"),

    css   = require("./repeating.css");

function child(ctrl, options, idx, data) {
    return  m("div", { class : css.child.join(" ") },
        m("div", { class : css.counter.join(" ") }, idx),
        m.component(children, {
            details : options.details.children,
            class   : css.fields.join(" "),
            data    : data,
            ref     : options.ref && options.ref.child(idx)
        }),
        m("div", { class : css.counter.join(" ") },
            m("button", {
                onclick : ctrl.remove.bind(ctrl, idx)
            }, "✘")
        )
    );
}

module.exports = {
    controller : function(options) {
        var ctrl = this;

        ctrl.children = (options.data && options.data.length) || 0;

        ctrl.add = function(e) {
            ++ctrl.children;
        };
        
        ctrl.remove = function(idx, e) {
            console.log("TODO: remove", arguments);
        };
    },

    view : function(ctrl, options) {
        var details = options.details;

        return m("div", { class : css[options.index ? "field" : "first"].join(" ") },
            details.instructions ? m.component(instructions, { details : details.instructions }) : null,
            options.data ?
                options.data.map(child.bind(null, ctrl, options)) :
                times(ctrl.children, child.bind(null, ctrl, options)),
            m("button", {
                class   : css.add.join(" "),
                onclick : ctrl.add
            }, "Add")
        );
    }
};
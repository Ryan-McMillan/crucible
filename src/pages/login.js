"use strict";

var m = require("mithril"),
    
    config = require("../config"),
    
    db     = require("../lib/firebase"),
    valid  = require("../lib/valid-auth"),
    prefix = require("../lib/prefix"),
    
    layout = require("./layout"),
    css    = require("./login.css");

function loginRedirect() {
    window.location = config.loginBaseUrl +
        window.encodeURIComponent(window.location.origin + config.root + "/login");
}

module.exports = {
    controller : function() {
        var ctrl = this;

        if(config.auth === "jwt") {
            m.startComputation();

            if(!m.route.param("auth")) {
                return loginRedirect();
            }

            db.authWithCustomToken(m.route.param("auth"), function(error) {
                if(error) {
                    return loginRedirect();
                }

                m.endComputation();
                
                return m.route(prefix("/"));
            });
        }
        
        if(!config.auth || valid()) {
            return m.route(prefix("/"));
        }
        
        ctrl.onsubmit = function(e) {
            var form = e.target.elements;
            
            e.preventDefault();
            
            db.authWithPassword({
                email    : form.email.value,
                password : form.password.value
            }, function(error) {
                if(error) {
                    ctrl.error = error.message;
                    
                    return m.redraw();
                }
                
                return m.route(prefix("/"));
            });
        };
        
        if(config.auth !== "password") {
            db.authWithOAuthRedirect(config.auth);
        }
    },
    
    view : function(ctrl) {
        return m.component(layout, {
            title   : "Login",
            content : m("div", { class : layout.css.content },
                m("form", { class : css.form, onsubmit : ctrl.onsubmit },
                    m("p",
                        m("label", { class : css.label }, "Email"),
                        m("input", { name : "email", type : "email" })
                    ),
                    m("p",
                        m("label", { class : css.label }, "Password"),
                        m("input", { name : "password", type : "password" })
                    ),
                    m("button", { class : css.button, type : "submit" }, "Login")
                ),
                
                m("p", { class : css.error }, ctrl.error ? "ERROR: " + ctrl.error : null)
            )
        });
    }
};

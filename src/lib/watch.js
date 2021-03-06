"use strict";

var db = require("./firebase");

// Ensure the updated timestamp is always accurate-ish
module.exports = function(ref) {
    ref.on("child_changed", function(snap) {
        var key = snap.key(),
            auth;
        
        // Avoid looping forever
        if(key === "updated_at" || key === "updated_by") {
            return;
        }
        
        auth = db.getAuth();
        
        // Clean up any old updated timestamps floating around
        ref.child("updated").remove();
        
        ref.update({
            updated_at : db.TIMESTAMP,
            updated_by : auth.uid
        });
    });
};

Media.publish("uploads", function() {
    if (!this.userId) {
        return [];
    }

    return Uploads.find({});
});
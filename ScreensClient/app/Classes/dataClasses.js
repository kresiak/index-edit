function FileInfo(id, filename, ourname, comment, duration, activated) {
    if (id) this.id = id;
    this.filename = filename;
    this.ourname = ourname;
    this.comment = comment;
    this.duration = duration;
    this.activated = activated;
}

FileInfo.prototype.isOk = function () {
    return !String.IsNullOrEmpty(this.ourname.Trim());
}

var _ = require("../")

var names = ["", "   ", "Jane", "Jenny", "Mery"]

_(names)
    .map(x=>x+"\n")
    .to_file("/tmp/rsg_test.txt")
    .done(function () {
        _.file("/tmp/rsg_test.txt")
            .split()
            .remove_blanks()
            .join_lines(";\n")
            .stdout()
            .done()
    });
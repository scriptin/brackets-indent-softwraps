define(function (require, exports, module) {
  "use strict";

  // Indent soft wraps, but only when line is indented with spaces
  function handleEditor(editor) {
    if (!editor) return;
    editor._codeMirror.on("renderLine", function (cm, line, elt) {
      var firstNonSpace = line.text.search(/[^\s\t]/);
      var tabsCount = line.text.substr(0, firstNonSpace).replace(/[^\t]/g, "").length;
      var off = firstNonSpace * cm.defaultCharWidth() + tabsCount * cm.getOption("tabSize");
      if (tabsCount === 0) {
        elt.style.textIndent = "-" + off + "px";
        elt.style.paddingLeft = off + "px";
      }
    });
    editor.refresh();
  }

  var AppInit = brackets.getModule('utils/AppInit'),
      EditorManager = brackets.getModule("editor/EditorManager");

  AppInit.appReady(function () {
    handleEditor(EditorManager.getCurrentFullEditor());
    $(EditorManager).on('activeEditorChange', function (event, focusedEditor, lostEditor) {
      handleEditor(focusedEditor);
    });
  });
});
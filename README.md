**NOTE: this project is no longer supported, because the feature is implemented in Brackets 1.6**

When you have a very long line it looks like this by dafault in Brackets editor:

    1 line with no indentation                                       |
    2     long line with indentation long line with indentation long | <- soft wrap
      line with indentation                                          |
    3 another line                                                   |

Notice how line #2 is not indented after softwrap. This extension makes it look like this:

    1 line with no indentation                                       |
    2     long line with indentation long line with indentation long |
          line with indentation                                      |
    3 another line                                                   |

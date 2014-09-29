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

*Limitation:* This only works on lines indented with spaces. I can't figure out
how to implement the same behavior for tab-indented lines. Please let me know
if there is a way.

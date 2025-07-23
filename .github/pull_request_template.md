# Description

Ref # (issue). 

<< Please include a summary of the changes and the related issue. List any dependencies that are required for this change.>>

# Checklist

**Manners**:
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have followed proper naming conventions for variables, functions and components
- [ ] I have made corresponding changes to the documentation
- [ ] I have organized the affected file(s) correctly
- [ ] I have not commited unnecessary codes and files 
- [ ] No unnecessary divs

**Prudence**:
- [ ] No new core components unless absolutely necessary
- [ ] I have avoided unnecessary rerenders - useMemo to be implemented to prevent unnecessary re rendering
- [ ] I have tested all test cases in the stage environment and attached evidence that my code is effective or that my feature works
- [ ] Lazy Load to be used for all high impact loading components - if new route is added
- [ ] Loading progress bar and skeleton with appropriate status messages to be applied appropriately
- [ ] Handle undefined/null/improper responses from APIs/functions with proper message
- [ ] Should not create un-named function
- [ ] Should have created/used only optimised and indexed SQL queries
- [ ] My changes generate no new warnings
- [ ] No text / lables left as string. It is converted into translation.json

**Re-use**:
- [ ] Should reuse available common functions wherever possible
- [ ] I have not created any new unnecessary local/Recoil state
- [ ] I have reused text / lables from translation.json

# How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration

- [ ] Test A
- [ ] Test B

**Test Configuration**:
Any setting that has to be done before performing this test.
* DB Tables updated with:
* Settings configuration:
* Test cases result:

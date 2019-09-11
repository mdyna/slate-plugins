import factory from './factory'
import slateAutoReplace from '../../packages/@axioscode/slate-auto-replace/package.json'
import slateCollapseOnEscape from '../../packages/@axioscode/slate-collapse-on-escape/package.json'
import slateDropOrPasteImages from '../../packages/@axioscode/slate-drop-or-paste-images/package.json'
import slatePasteLinkify from '../../packages/@axioscode/slate-paste-linkify/package.json'
import slateSoftBreak from '../../packages/@axioscode/slate-soft-break/package.json'
import slateWhen from '../../packages/@axioscode/slate-when/package.json'

const configurations = [
  ...factory(slateAutoReplace),
  ...factory(slateCollapseOnEscape),
  ...factory(slateDropOrPasteImages),
  ...factory(slatePasteLinkify),
  ...factory(slateSoftBreak),
  ...factory(slateWhen),
]

export default configurations

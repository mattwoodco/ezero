- the app is running on localhost:3000
- the app uses tailwind version 4, next.js version 15, shadcn and nuqs
- use chrome dev tools to validate the design matches the spec and use Playwright MCP to validate functionality
- when you're done, lint and typecheck

Create a email editor canvas. The canvas has a centered container of max-width 600px called email-template. The centered container vertically stacks email-template-blocks, with no gap. each block has a type that determines its content and settings. each block has a transparent border of 1px. When the user hovers over a block, the border become primary color and a soft 2xl shadow appears, using transtions. When the user hovers over a block, a centered cicle with a plus appears on top and bottom of the block. Clicking either buttons adds a new block above or below. User can "select" a block by clicking on it. When a block is selected, a vertical icon ghost button list appears vertically centered, 20px to the right of the selected block. the icons are: move up, move down, save to favorites, duplicate, delete. When a block is selected, a 360px wide settings panel appears on the right side of the screen. at the botton of the settings panel is a footer with Undo, Redo on the left and Saved status on the right. 
the settings panel has a header with centerd ghost tab triggers. For now, the tabs are "Block", "Font", and "Link" with placeholder content.

The main canvas has a vertical icon ghost button list positioned fixed top-20 left-20, with the following icons: Send, Favorite, Share. The style is consistent with the other ghost button lists. Whenever a icon button is hovered a shadnc tooptip appears with the name of the action. Whenever a block is hovered, the same tooltip appears with "BLOCK_TYPE settings" where BLOCK_TYPE is the type of the block. Tooltips should instantly appear, and have a subtle fade in transition. Ensure a clean experience when quickly hovering over multiple icons or blocks.

The main canvas has a fixed top-20 right-20 horizontla icon ghost button list with the following icons: Dekstop, SmartPhone, with the same tooltip behavior for "desktop previw and mobile preview. clicking either renders a full screen dialog with the email template in the respective view mode, and a Back ghost button with icon and label on the top left to close the dialog. Below the back ubtton is the same  icon ghost button list with Dekstop, SmartPhone icons, but in this case the active mode shows the icon as primary color and the unselected mode shows the icon as muted. Clicking either icon switches the view mode, while keeping the dialog open. Render the destkop without a frame, but render the smartphone inside iphon-like rounded-container with a border, that sits inside a container with 10px padding that has a matching border and rounded corners. Transition show a shadow when oevering over the smartphone preview container.

Ensure we are using React-email package to render the email template inside the email-template container and in the preview dialog. Ensure we are using nuqs to handle state in the URL.

Add a fullwidth Header with subtle dropshadow, no border to to the top iof the entire canvas, but ensure the preview dialog does not show the header. The header has a left aligned "e0" monotype font logo, and right aligned "Export" ghost icon button with tooltip.

the entire canvas uses bg-background, there are no borders anywhhere excpt for blocks


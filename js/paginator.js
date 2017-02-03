const React = require("react")
const classes = require("./classes")

const $ = React.createElement

const PREV_TEXT = "◀ prev"
const NEXT_TEXT = "next ▶"

function buttonClass(show) {
  return classes(
    "db w-100",
    "ba br2",
    "pv3 ph4",
    "b f4",
    "ttu",
    "chunky-focus",
    show
      ? "b--black-30 bg-white pointer"
      : "b--black-10 black-20 bg-transparent"
  )
}

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

function prevButton({updatePagePrev}, show) {
  const onClick = () => {
    scrollToTop()
    updatePagePrev()
  }
  return $("button", {
    onClick,
    disabled: !show,
    className: buttonClass(show)
  }, PREV_TEXT)
}

function nextButton({updatePageNext}, show) {
  const onClick = () => {
    scrollToTop()
    updatePageNext()
  }
  return $("button", {
    onClick,
    disabled: !show,
    className: buttonClass(show)
  }, NEXT_TEXT)
}

function Paginator(props) {
  const {
    currentPage,
    pageSize,
    items,
    emptyState,
    render
  } = props
  const numPages = Math.ceil(items.length / pageSize)
  const hasPrev = currentPage > 0
  const hasNext = currentPage < (numPages - 1)
  const i = pageSize * currentPage
  const pageItems = items.slice(i, i + pageSize)
  const paginationButtons =
    $("div", {className: "flex"},
      $("div", {className: "ph1 flex-auto"}, prevButton(props, hasPrev)),
      $("div", {className: "ph1 flex-auto"}, nextButton(props, hasNext))
    )
  return $("div", {},
    paginationButtons,
    pageItems.length === 0
      ? emptyState
      : $("div", {key: `page-${currentPage}`}, pageItems.map(render)),
    paginationButtons
  )
}

module.exports = Paginator
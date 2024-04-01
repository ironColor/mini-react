function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        dom.addEventListener(eventType, props[key]);
      } else {
        dom[key] = props[key];
      }
    }
  });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

let nextWorkOfUnit = null;
let root = null;
let currentRoot = null;
function workLoop(deadLine) {
  let shouldYied = false;

  while (!shouldYied && nextWorkOfUnit) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit);
    shouldYied = deadLine.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commit();
  }

  requestIdleCallback(workLoop);
}

function commit() {
  commitwork(root.child);
  // 在提交之前，记录当前dom树的根节点
  currentRoot = root;
  root = null;
}

function commitwork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) fiberParent.dom.append(fiber.dom);

  commitwork(fiber.child);
  commitwork(fiber.sibling);
}

function updateFunctionComponet(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    // work.parent.dom.append(dom);
    // 处理props
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  // 转换链表 设置指针
  initChildren(fiber, children);
}

function performUnitOfWork(work) {
  const isFunctionComponent = typeof work.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(work);
  } else {
    updateFunctionComponet(work);
  }
  // 返回下一个需要执行的任务
  if (work.child) {
    return work.child;
  }
  if (work.sibling) return work.sibling;
  // 当前节点 即无子节点也无兄弟节点 就返回叔叔节点
  let nextFiber = work;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  // return work.parent.sibling;
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;

import React from "react";
import ReactDOM from 'react-dom/client';
import { Modal, Input } from "antd";

const InputModal = React.forwardRef((props, ref) => {
    const [title, setTitle] = React.useState('')
    const [visible, setVisible] = React.useState(false)
    const [placeholder, setPlaceholder] = React.useState('')
    const [value, setValue] = React.useState('')
    const [callback, setCallback] = React.useState({ resolve: null, reject: null })

    const onOk = () => {
        if (callback.resolve) {
            callback.resolve(value)
        }
        setVisible(false)
    }

    const onCancel = () => {
        if (callback.reject) {
            callback.reject(value)
        }
        setVisible(false)
    }

    React.useImperativeHandle(ref, () => ({
        show: async (option) => {
            const { title, placeholder, value } = option
            setTitle(title)
            setPlaceholder(placeholder)
            setValue(value)
            return new Promise((resolve, reject) => {
                setCallback({ resolve, reject })
                setVisible(true)
            })
        }
    }))

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={e => { setValue(e.target.value) }} />
        </Modal>
    )
})

class MyModal {
    constructor() {
        let ref = { current: '' }
        const div = document.createElement('div');
        document.body.append(div)
        ReactDOM.createRoot(div).render(<InputModal ref={ref} />)
        this.ref = ref
    }

    input = (option) => {
        return this.ref.current.show(option)
    }
}

MyModal.getInstance = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new MyModal();
        }
        return instance;
    }
})()

export const modal = MyModal.getInstance()
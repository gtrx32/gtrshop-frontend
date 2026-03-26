export default defineAppConfig({
    ui: {
        button: {
            slots: {
                base: ['inline-flex items-center justify-center gap-1 font-normal rounded-lg cursor-pointer'],
                leadingIcon: ['mt-0.5'],
            },
            variants: {
                variant: {
                    ghost: 'border border-gtr-soft shadow-sm shadow-gtr-soft',
                    link: '!px-0 justify-start',
                },
            },
            compoundVariants: [
                {
                    variant: 'link',
                    size: 'md',
                    class: 'text-md py-0'
                }
            ],
            defaultVariants: {
                color: 'primary',
                variant: 'ghost',
                size: 'xl'
            }
        },
        checkbox: {
            slots: {
                root: 'cursor-pointer',
                base: 'cursor-pointer',
                label: 'cursor-pointer',
                description: 'cursor-pointer',
            },
        },
        switch: {
            slots: {
                root: 'cursor-pointer',
                base: 'cursor-pointer',
                label: 'cursor-pointer',
                description: 'cursor-pointer',
            },
        },
        select: {
            slots: {
                base: 'cursor-pointer',
                item: 'cursor-pointer',
            },
        },
        tabs: {
            slots: {
                trigger: 'cursor-pointer',
            },
        },
        slider: {
            slots: {
                root: 'cursor-pointer',
                thumb: 'cursor-pointer',
            },
        },
        carousel: {
            slots: {
                prev: 'cursor-pointer',
                next: 'cursor-pointer',
            },
        },
        pagination: {
            slots: {
                list: 'flex flex-wrap justify-center sm:flex-nowrap',
                first: 'size-10 cursor-pointer',
                prev: 'size-10 cursor-pointer',
                item: 'size-10 cursor-pointer',
                next: 'size-10 cursor-pointer',
                last: 'size-10 cursor-pointer',
                ellipsis: 'size-10',
            },
        },
        toast: {
            slots: {
                title: 'text-lg',
                description: 'text-base',
            },
        },
    }
})
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface OperationCardProps {
  title: string
  specs: Record<string, string>
  description: string
  image: string
  index: number
}

function OperationCard({ title, specs, description, image, index }: OperationCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-gray-900 bg-opacity-50 p-6 border border-gray-800"
    >
      <h3 className="font-mono text-xl mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-sm">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key}>
            <span className="text-gray-500">{key}: </span>
            <span className="text-gray-300">{value}</span>
          </div>
        ))}
      </div>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover mb-4 opacity-80"
      />
      <p className="font-mono text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default function OperationsSection() {
  const operations = [
    {
      title: "TACTICAL RECONNAISSANCE",
      specs: {
        "RANGE": "25KM",
        "DURATION": "72HRS",
        "TEAM SIZE": "4-6",
        "SUCCESS RATE": "97%"
      },
      description: "Advanced surveillance and intelligence gathering operations utilizing state-of-the-art equipment and experienced personnel.",
      image: "/recon.jpg"
    },
    {
      title: "STRATEGIC DEFENSE",
      specs: {
        "COVERAGE": "URBAN",
        "CAPACITY": "BATTALION",
        "RESPONSE": "< 15MIN",
        "EFFICIENCY": "94%"
      },
      description: "Comprehensive defensive operations protecting critical infrastructure and civilian populations.",
      image: "/defense.jpg"
    },
    {
      title: "RAPID RESPONSE",
      specs: {
        "MOBILITY": "HIGH",
        "DEPLOYMENT": "< 30MIN",
        "RADIUS": "50KM",
        "READINESS": "24/7"
      },
      description: "Quick reaction force capable of immediate deployment to emerging threats and situations.",
      image: "/response.jpg"
    }
  ]

  return (
    <section id="operations" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-mono text-2xl mb-12 flex items-center">
            <span className="w-8 h-px bg-gray-500 mr-4"></span>
            OPERATIONAL CAPABILITIES
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operations.map((op, index) => (
              <OperationCard key={op.title} {...op} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

